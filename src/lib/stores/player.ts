import { localStorageStore } from './localStorageStore';
import { derived } from 'svelte/store';

export const financeState = localStorageStore({
	balance: 0,
});
export interface Card { suit: string; rank: number }

export const auctionState = localStorageStore({
	winner: '',
	player: null,
	auctionTitle: '',
	currentBid: 0,
	soldPrice: 0,
	round: 1,
});

export const gameStore = localStorageStore('game', {
    players: [],
});

export const loadingMessage = localStorageStore('loadingMessage', {
	message: "Loading...",
});

export const lotsStore = localStorageStore('lots', {
	cards: [] as Card[]
});

export const playerStore = localStorageStore('player',{
    id: null,
    lobbyId: null,
    name: "Guest",
    color: "#000000",
	rounds_won: 0,
    balance: 0,
	hole_cards: [] as Card[]
});