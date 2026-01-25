import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store'
import type { Card } from '$lib/cardHelper';

export interface Joker {
  key: 'bid-sweep' | 'sneak-peek' | 'block-bid',
  name: string,
  description: string,
  allowed: boolean,
  price: number,
  requiresTarget?: boolean
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
