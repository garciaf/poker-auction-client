import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store'
import type { Card } from '$lib/cardHelper';

export interface Joker {
  key: 'bid-sweep' | 'sneak-peek' | 'block-bid' | 'love' | 'flip-hole-cards',
  name: string,
  description: string,
  allowed: boolean,
  price: number,
  requiresTarget?: boolean,
  /** How many a player can hold at once; 0 or missing = no limit. */
  maxPerPlayer?: number
}

export interface GamePlayer {
  id: string;
  name: string;
  color: string;
}

export const mappingJokerKeyToAsset = {
  "sneak-peek": "joker-sneak-peek.png",
  "bid-sweep": "joker-bid-sweep.png",
  "block-bid": "block.png",
  "love": "joker-love.png",
  "flip-hole-cards": "joker-flip-hole-cards.png"
}
export interface Notification { message: string; author: string; }
export const notifications = writable<Notification[]>([]);

export const gameStore = persisted('game', {
    players: [] as GamePlayer[],
}, { storage: 'session' });

export const loadingMessage = persisted('loadingMessage', {
	message: "Loading...",
}, { storage: 'session' });
export const lotsStore = persisted('lots', {
	cards: [] as Card[]
});

// The silent auction screen: smallest bid, and why the last bid was refused
// (empty when there is nothing to fix). "at" changes each time the game sends it.
export const silentAuctionStore = persisted('silentAuction', {
  minBid: 1,
  error: '',
  at: 0,
}, { storage: 'session' });

export const shopStore = persisted('shop', {
    jokers: [] as Joker[]
}, { storage: 'session' })

export const bonusStore = persisted('bonus', {
  amount: 0 as Number
}, { storage: 'session' })

export const playerStore = persisted('player',{
    id: null,
    lobbyId: "",
    name: "Guest",
    color: "#000000",
	  rounds_won: 0,
    balance: 0,
	  hole_cards: [] as Card[],
    jokers: [] as Joker[]
}, { storage: 'session' });

export function updateJokerStatus(jokerKey: string, allowed: boolean) {
  playerStore.update(player => {
    const hasJoker = player.jokers.some(j => j.key === jokerKey);
    
    if (!hasJoker) {
      return player;
    }
    
    const updatedJokers = player.jokers.map(joker => 
      joker.key === jokerKey 
        ? { ...joker, allowed }
        : joker
    );
    
    return {
      ...player,
      jokers: updatedJokers
    };
  });
}

export const isCardHidden = writable<boolean>(false);

// Connection status store for UI feedback
export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  reconnectAttempt: number;
  maxAttempts: number;
  lastError: string | null;
}

export const connectionStatus = writable<ConnectionStatus>({
  connected: false,
  reconnecting: false,
  reconnectAttempt: 0,
  maxAttempts: 50,
  lastError: null
});
