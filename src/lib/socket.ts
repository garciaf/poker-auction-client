import { io, type Socket as IOSocket } from 'socket.io-client';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import { playerStore, connectionStatus } from '$lib/stores/player';

const serverUrl = import.meta.env.VITE_WEBSOCKET_URL;

type Callback = (...args: any[]) => void;

class Socket {
  private socket: IOSocket | null = null;
  private listeners: Map<string, Callback[]> = new Map();
  public disconnected = true;

  private readonly maxReconnectAttempts = 50;

  // Lobby state tracking
  private currentLobbyId: string | null = null;
  private shouldReconnectToLobby: boolean = true;

  // Message queue for offline critical actions
  private messageQueue: Array<{ event: string; data?: any; to?: string; timestamp: number }> = [];
  private readonly MAX_QUEUE_SIZE = 50;
  private readonly QUEUE_MESSAGE_TTL = 60000; // 1 minute

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.socket = io(serverUrl, {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      // Called on every connection attempt so the server always gets the current clientId
      auth: (cb) => cb({ clientId: this.getPlayerId() }),
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      this.disconnected = false;
      connectionStatus.set({
        connected: true,
        reconnecting: false,
        reconnectAttempt: 0,
        maxAttempts: this.maxReconnectAttempts,
        lastError: null,
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected from server:', reason);
      this.disconnected = true;
      connectionStatus.update(s => ({ ...s, connected: false, reconnecting: true }));
    });

    this.socket.io.on('reconnect_attempt', (attempt) => {
      console.log(`[Socket] Reconnection attempt ${attempt}/${this.maxReconnectAttempts}`);
      connectionStatus.update(s => ({
        ...s,
        reconnecting: true,
        reconnectAttempt: attempt,
        maxAttempts: this.maxReconnectAttempts,
      }));
    });

    this.socket.io.on('reconnect_failed', () => {
      console.error('[Socket] Max reconnection attempts reached');
      connectionStatus.update(s => ({
        ...s,
        reconnecting: false,
        lastError: 'Max reconnection attempts reached',
      }));
      const callbacks = this.listeners.get('max_reconnect_failed') || [];
      callbacks.forEach(cb => cb({ attempts: this.maxReconnectAttempts }));
    });

    // Dispatch all incoming events to local listeners.
    // Server system events (connected, reconnected, lobby-not-found) send payload flat: { from, lobbyId }.
    // Server-routed game events wrap the inner data:                                    { data: {...}, from, lobbyId }.
    // Passing payload.data when present preserves existing callback signatures.
    this.socket.onAny((event, payload) => {
      const callbacks = this.listeners.get(event) || [];
      const arg = payload?.data !== undefined ? payload.data : payload;
      callbacks.forEach(cb => cb(arg));
    });

    this.on('connected', (data: any) => {
      this.disconnected = false;
      playerStore.update(state => ({ ...state, id: data.from }));
      this.flushMessageQueue();
    });

    this.on('reconnected', (data: any) => {
      console.debug('[Socket] Reconnected:', data);
      this.disconnected = false;
      playerStore.update(state => ({ ...state, id: data.from, lobbyId: data.lobbyId }));
      this.flushMessageQueue();
      this.emit('player-reconnected');
    });

    this.on('lobby-not-found', (data: any) => {
      console.warn('[Socket] Lobby not found:', data);
    });
  }

  public on(eventName: string, callback: Callback): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName)?.push(callback);
  }

  public emit(event: string, data?: any, to?: string): void {
    console.log(`[Socket] Emitting event: ${event}`, data);
    const playerId = this.getPlayerId();

    // 'join-lobby' is handled by a dedicated server listener expecting { lobbyId } directly,
    // not the generic routing wrapper used by all other events.
    if (event === 'join-lobby') {
      this.socket?.emit(event, data);
      return;
    }

    if (this.socket?.connected) {
      this.socket.emit(event, { data, from: playerId, to: to || null });
    } else {
      if (this.isCriticalMessage(event)) {
        this.queueMessage(event, data, to);
        console.warn('[Socket] Socket is not connected, critical message queued');
      } else {
        console.warn('[Socket] Socket is not connected, message not sent');
      }
    }
  }

  public disconnect(): void {
    this.socket?.disconnect();
  }

  public reconnect(): void {
    this.socket?.connect();
  }

  public leaveLobby(): void {
    console.log('[Socket] Leaving lobby:', this.currentLobbyId);
    playerStore.update(state => ({ ...state, lobbyId: '' }));
    this.currentLobbyId = null;
    this.shouldReconnectToLobby = false;
  }

  public joinLobby(lobbyId: string): void {
    console.log('[Socket] Joining lobby:', lobbyId);
    this.currentLobbyId = lobbyId;
    this.shouldReconnectToLobby = true;
  }

  public retryReconnection(): void {
    console.log('[Socket] Manual reconnection retry triggered');
    this.shouldReconnectToLobby = true;
    // Reset Socket.IO's internal attempt counter then reconnect
    if (this.socket) {
      this.socket.io.reconnectionAttempts(this.maxReconnectAttempts);
      this.socket.connect();
    }
    connectionStatus.update(s => ({ ...s, reconnecting: true, reconnectAttempt: 0 }));
  }

  public getPlayerId(): string | null {
    return get(playerStore).id;
  }

  public getLobbyId(): string | null {
    return get(playerStore).lobbyId;
  }

  private isCriticalMessage(event: string): boolean {
    return ['new-bid', 'buy', 'select-card', 'use-joker', 'new-offer'].includes(event);
  }

  private queueMessage(event: string, data?: any, to?: string): void {
    if (this.messageQueue.length >= this.MAX_QUEUE_SIZE) {
      this.messageQueue.shift();
    }
    this.messageQueue.push({ event, data, to, timestamp: Date.now() });
    console.log(`[Socket] Message queued (${this.messageQueue.length} in queue)`);
  }

  private flushMessageQueue(): void {
    const now = Date.now();
    const valid = this.messageQueue.filter(m => now - m.timestamp < this.QUEUE_MESSAGE_TTL);
    this.messageQueue = [];
    if (valid.length > 0) {
      console.log(`[Socket] Flushing ${valid.length} queued messages`);
      for (const msg of valid) {
        this.emit(msg.event, msg.data, msg.to);
      }
    }
  }
}

let socket: Socket | null = null;

if (browser) {
  socket = new Socket();
}

export default socket;
