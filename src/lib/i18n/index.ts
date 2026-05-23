import type { Config } from 'sveltekit-i18n';
import i18n from 'sveltekit-i18n';

import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';

const config: Config<Record<string, any>> = {
	translations: {
		en,
		fr,
		de
	},
	loaders: [],
	initLocale: 'en',
	fallbackLocale: 'en'
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);

// Available locales with metadata
export const availableLocales = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'fr', name: 'Français', flag: '🇫🇷' },
	{ code: 'de', name: 'Deutsch', flag: '🇩🇪' }
] as const;

export type LocaleCode = 'en' | 'fr' | 'de';
