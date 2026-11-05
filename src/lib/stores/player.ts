import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store'
import type { Card } from '$lib/cardHelper';

export type JokerKey =
  | 'bid-sweep' | 'sneak-peek' | 'block-bid' | 'love' | 'flip-hole-cards'
  | 'poker-face' | 'burn-card' | 'pickpocket' | 'greedy-hands';

/**
 * What the player picks to play the joker, besides a target player:
 * - 'community-card': a card on the table (Burn Card)
 * - 'lot-and-hole-card': a card of the lot, then one of their hole cards (Pickpocket)
 * The cards are sent with 'use-joker' as `cards`, in that order.
 */
export type JokerChoice = '' | 'community-card' | 'lot-and-hole-card';

export interface Joker {
  key: JokerKey,
  name: string,
  description: string,
  allowed: boolean,
  price: number,
  requiresTarget?: boolean,
  /** How many a player can hold at once; 0 or missing = no limit. */
  maxPerPlayer?: number,
  /** Works on its own while held, never played (Poker Face). */
  passive?: boolean,
  /** Only the auction winner plays it, while picking the card (Pickpocket, Greedy Hands). */
  winnerOnly?: boolean,
  choose?: JokerChoice
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
  "flip-hole-cards": "joker-flip-hole-cards.png",
  "poker-face": "joker-poker-face.png",
  "burn-card": "joker-burn-card.png",
  "pickpocket": "joker-pickpocket.png",
  "greedy-hands": "joker-greedy-hands.png"
}
// With a card (Sneak Peek), it stays on screen until the player closes it.
export interface Notification { message: string; author: string; card?: Card; }
export const notifications = writable<Notification[]>([]);

export const gameStore = persisted('game', {
    players: [] as GamePlayer[],
}, { storage: 'session' });

export const loadingMessage = persisted('loadingMessage', {
	message: "Loading...",
}, { storage: 'session' });
// The lot the auction winner picks from, and how many cards of it go on the
// table (2 with Greedy Hands; missing = 1).
export const lotsStore = persisted('lots', {
	cards: [] as Card[],
	count: 1 as number
});

// The cards on the table (the game sends them each time they change).
export const tableStore = persisted('table', {
	cards: [] as Card[]
}, { storage: 'session' });

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
