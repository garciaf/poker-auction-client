import { persisted } from 'svelte-persisted-store';
import type { LocaleCode } from '$lib/i18n';

// Persisted locale preference store
export const localePreference = persisted<LocaleCode>('poker-auction-locale', 'en');
