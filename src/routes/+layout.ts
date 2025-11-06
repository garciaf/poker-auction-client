import { loadTranslations } from '$lib/i18n';
import { get } from 'svelte/store';
import { localePreference } from '$lib/stores/locale';
import type { LayoutLoad } from './$types';

// Enable prerendering for static site generation
export const prerender = true;

export const load: LayoutLoad = async () => {
	const locale = get(localePreference);
	await loadTranslations(locale);

	return {};
};
