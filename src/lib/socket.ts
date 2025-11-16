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
      
      const playerId = this.getPlayerId();
      if (playerId) {
        this.emit('reconnect', { clientId: playerId });
      } else {
        this.emit('connect', { clientId: playerId });
      }
    });

    this.socket.addEventListener('close', (event) => {
      this.disconnected = true;
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
    });
  }

  private attemptReconnect(): void {
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
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
  }

  public reconnect(): void {
    this.intentionalClose = false;
    this.reconnectAttempts = 0;
    this.disconnect();
    this.connect();
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