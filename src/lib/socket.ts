import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { playerStore } from '$lib/stores/player';

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

type EventPayload = {
  event: string;
  data: any;
  from: string | null;
  to: string | null;
  lobbyId?: string | null;
};

type Callback = (...args: any[]) => void;

class Socket {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Callback[]>;
  public disconnected = true;

  // Reconnection config
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  // Heartbeat config
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly HEARTBEAT_INTERVAL = 25000;
  private readonly HEARTBEAT_TIMEOUT = 5000;

  // Lobby state tracking
  private currentLobbyId: string | null = null;
  private shouldReconnectToLobby: boolean = true;

  constructor() {
    this.listeners = new Map();
    this.connect();
  }

  private connect(): void {
    this.socket = new WebSocket(websocketUrl);

    this.socket.addEventListener('message', (event: MessageEvent) => {
      try {
        const eventPayload: EventPayload = JSON.parse(event.data);
        const callbacks = this.listeners.get(eventPayload.event) || [];
        callbacks.forEach(cb => cb(eventPayload.data));
      } catch (e) {
        console.error('[Socket] Failed to parse message:', e);
      }
    });

    this.socket.addEventListener('open', () => {
      console.log('[Socket] Connected to server');
      this.disconnected = false;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;

      // Start heartbeat after connection
      this.startHeartbeat();

      const playerId = this.getPlayerId();
      const lobbyId = this.getLobbyId();

      // Detect lobby transition
      const lobbyChanged = this.currentLobbyId !== null && this.currentLobbyId !== lobbyId;
      if (lobbyChanged) {
        console.log('[Socket] Lobby changed from', this.currentLobbyId, 'to', lobbyId);
        this.shouldReconnectToLobby = true; // Allow reconnecting to new lobby
      }

      // Only attempt reconnection if we should reconnect and have valid credentials
      if (playerId && lobbyId && lobbyId.trim() !== '' && this.shouldReconnectToLobby) {
        console.log('[Socket] Attempting to reconnect to lobby:', lobbyId);
        this.currentLobbyId = lobbyId; // Track the lobby we're connecting to
        this.emit('reconnect', { clientId: playerId, lobbyId: lobbyId });
      } else if (playerId && lobbyId && lobbyId.trim() !== '' && !this.shouldReconnectToLobby) {
        console.log('[Socket] Skipping reconnect - lobby reconnection disabled');
        this.emit('connect', { clientId: playerId });
      } else if (playerId) {
        console.log('[Socket] Connected without lobby');
        this.currentLobbyId = null;
        this.emit('connect', { clientId: playerId });
      } else {
        console.log('[Socket] Connected as new client');
        this.currentLobbyId = null;
        this.emit('connect', { clientId: null });
      }
    });

    this.socket.addEventListener('close', (event) => {
      this.disconnected = true;
      this.stopHeartbeat(); // ← CRITICAL: Stop heartbeat when connection closes
      console.warn('[Socket] Disconnected from server', event.code, event.reason);

      if (!this.intentionalClose) {
        this.attemptReconnect();
      }
    });

    this.socket.addEventListener('error', (error: Event) => {
      console.error('[Socket] Error:', error);
    });

    this.on('connected', (data: any) => {
      this.disconnected = false;
      playerStore.update(state => ({ ...state, id: data.from }));
    });

    this.on('reconnected', (data: any) => {
      console.debug('[Socket] Reconnected:', data);
      this.disconnected = false;
      playerStore.update(state => ({ ...state, id: data.from, lobbyId: data.lobbyId }));
      this.emit('player-reconnected');
    });

    this.on('pong', () => {
      console.debug('[Socket] Received pong from server');
      if (this.heartbeatTimeout) {
        clearTimeout(this.heartbeatTimeout);
        this.heartbeatTimeout = null;
      }
    });

    // Handle server events for invalid/non-existent lobbies
    this.on('lobby-not-found', (data: any) => {
      console.warn('[Socket] Lobby no longer exists:', data);
      // Clear the lobbyId since the lobby doesn't exist
      playerStore.update(state => ({ ...state, lobbyId: '' }));
      this.currentLobbyId = null;
      this.shouldReconnectToLobby = false;
      this.disconnect(); // Stop trying to reconnect to non-existent lobby
    });
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    console.log('[Socket] Starting heartbeat');
    
    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        console.debug('[Socket] Sending ping');
        this.emit('ping', { timestamp: Date.now() });
        
        this.heartbeatTimeout = setTimeout(() => {
          console.warn('[Socket] No pong received, connection appears dead');
          this.socket?.close();
        }, this.HEARTBEAT_TIMEOUT);
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  private attemptReconnect(): void {
    // Clean up any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Socket] Max reconnection attempts reached');
      const callbacks = this.listeners.get('max_reconnect_failed') || [];
      callbacks.forEach(cb => cb({ attempts: this.reconnectAttempts }));
      return;
    }

    this.reconnectAttempts++;
    
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(`[Socket] Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    const callbacks = this.listeners.get('reconnecting') || [];
    callbacks.forEach(cb => cb({ 
      attempt: this.reconnectAttempts, 
      maxAttempts: this.maxReconnectAttempts,
      delay 
    }));

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  public disconnect(): void {
    this.intentionalClose = true;
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
  }

  public reconnect(): void {
    // Stop any pending reconnection attempts
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Reset state
    this.reconnectAttempts = 0;
    this.intentionalClose = false; // ← Set BEFORE closing

    // Close existing connection if any
    this.stopHeartbeat();
    if (this.socket) {
      // Temporarily set intentionalClose to true just for this close
      this.intentionalClose = true;
      this.socket.close();
    }

    // Now reset and connect
    this.intentionalClose = false; // ← Reset for new connection
    this.connect();
  }

  public leaveLobby(): void {
    console.log('[Socket] Leaving lobby:', this.currentLobbyId);
    // Clear the lobbyId from the store
    playerStore.update(state => ({ ...state, lobbyId: '' }));
    // Prevent reconnecting to the old lobby
    this.currentLobbyId = null;
    this.shouldReconnectToLobby = false;
    // Reset reconnection attempts
    this.reconnectAttempts = 0;
  }

  public joinLobby(lobbyId: string): void {
    console.log('[Socket] Joining lobby:', lobbyId);
    // Allow reconnection to this new lobby
    this.currentLobbyId = lobbyId;
    this.shouldReconnectToLobby = true;
    // Reset reconnection attempts for fresh start
    this.reconnectAttempts = 0;
  }

  public on(eventName: string, callback: Callback): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(callback);
  }

  public getPlayerId(): string | null {
    return get(playerStore).id;
  }

  public getLobbyId(): string | null {
    return get(playerStore).lobbyId;
  }

  public emit(event: string, data?: any, to?: string): void {
    console.log(`[Socket] Emitting event: ${event}`, data);
    const lobbyId = get(playerStore).lobbyId;
    const playerId = get(playerStore).id;

    const message: EventPayload = { event, data, from: playerId, to: to || null, lobbyId };
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('[Socket] Socket is not open, message not sent');
    }
  }
}

// Instantiate only in the browser
let socket: Socket | null = null;

if (browser) {
  socket = new Socket();
}

export default socket;