import { derived, writable } from 'svelte/store';
import type { Config } from 'sveltekit-i18n';
import i18n from 'sveltekit-i18n';

// Import translations
import en from './locales/en.json';
import fr from './locales/fr.json';

export interface Translations {
	common: {
		lobbyId: string;
		playerName: string;
		yourName: string;
		start: string;
		ready: string;
		loading: string;
		guest: string;
	};
	actions: {
		joinLobby: string;
		buyNow: string;
		selectCard: string;
		selectJoker: string;
		submitBid: string;
	};
	messages: {
		welcomeAuction: string;
		gameStartsWhenReady: string;
	};
	placeholders: {
		lobbyIdExample: string;
		yourName: string;
		bidAmount: string;
	};
	languages: {
		english: string;
		french: string;
	};
}

const config: Config<Translations> = {
	translations: {
		en,
		fr
	},
	loaders: [],
	initLocale: 'en',
	fallbackLocale: 'en'
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

// Available locales with metadata
export const availableLocales = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' }
] as const;

export type LocaleCode = 'en' | 'fr';
