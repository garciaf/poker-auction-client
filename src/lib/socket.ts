import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import { playerStore } from '$lib/stores/player'; // use $lib path if inside src/lib

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
  private socket: WebSocket;
  private listeners: Map<string, Callback[]>;
  public disconnected = true;

  constructor() {
    this.listeners = new Map();
    this.socket = new WebSocket(websocketUrl);

    this.on('connected', (data: any) => {
      this.disconnected = false;
      playerStore.update(state => ({ ...state, id: data.from }));
    });

    this.on('reconnected', (data: any) => {
      console.debug('[Socket] Reconnected:', data);
      this.disconnected = false;
      playerStore.update(state => ({ ...state, id: data.from, lobbyId: data.lobbyId }));
    });

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
      if (this.disconnected) {
        this.emit('connect', { clientId: this.getPlayerId() });
        console.warn('[Socket] Connected to server');
      }
    });

    this.socket.addEventListener('close', () => {
      this.disconnected = true;
      console.warn('[Socket] Disconnected from server');
    });

    this.socket.addEventListener('error', (error: Event) => {
      console.error('[Socket] Error:', error);
    });

    this.socket.onclose = () => {
      this.disconnected = true;
      console.warn('[Socket] WebSocket connection closed');
    };
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
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('[Socket] Socket is not open, waiting for connection...');
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(message));
      };
    }
  }
}

// Instantiate only in the browser
let socket: Socket | null = null;

if (browser) {
  socket = new Socket();
}

export default socket;
