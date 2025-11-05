import { writable } from 'svelte/store';
import { persisted } from 'svelte-persisted-store'
export interface Card { suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' ; rank: number }
export interface Joker { key: 'bid-sweep' | 'sneak-peek', name: String, description: String, allowed: boolean }
export interface Notification { message: string; author: string; }

export const notifications = writable<Notification[]>([]);

export const gameStore = persisted('game', {
    players: [],
});

export const loadingMessage = persisted('loadingMessage', {
	message: "Loading...",
});

export const lotsStore = persisted('lots', {
	cards: [] as Card[]
});

export const shopStore = persisted('shop', {
    jokers: [] as Joker[]
})

export const playerStore = persisted('player',{
    id: null,
    lobbyId: "",
    name: "Guest",
    color: "#000000",
	rounds_won: 0,
    balance: 0,
	hole_cards: [] as Card[],
    jokers: [] as Joker[]
});

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
