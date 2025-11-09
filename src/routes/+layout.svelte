<script>
  import '../app.css';
  import LiveNavigation  from '$lib/liveNavigation';
  import PlayerTag from '$lib/components/PlayerTag.svelte';
  import Notifications from '$lib/components/Notifications.svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import { base } from '$app/paths'; // ✅ use base path from SvelteKit
  import { locale } from '$lib/i18n';
  import { localePreference } from '$lib/stores/locale';
  import { onMount } from 'svelte';
  import { playerStore } from '$lib/stores/player';
  // Sync locale with persisted preference
  onMount(() => {
    const unsubscribe = localePreference.subscribe(value => {
      locale.set(value);
    });
    return unsubscribe;
  });
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="{base}/images/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</svelte:head>

<main class="bg-poker-green h-dvh text-white overflow-auto">
  <header class="px-5 py-3 flex justify-between items-center shadow-xl" style={`background-color: ${$playerStore.color};`}>
    <PlayerTag />
    <LanguageSwitcher />
  </header>
  <Notifications />
  <slot />
</main>