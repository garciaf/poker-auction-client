import { persisted } from 'svelte-persisted-store'
export interface Card { suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' ; rank: number }

export const gameStore = persisted('game', {
    players: [],
});

export const loadingMessage = persisted('loadingMessage', {
	message: "Loading...",
});

export const lotsStore = persisted('lots', {
	cards: [] as Card[]
});

export const playerStore = persisted('player',{
    id: null,
    lobbyId: null,
    name: "Guest",
    color: "#000000",
	rounds_won: 0,
    balance: 0,
	hole_cards: [] as Card[]
});