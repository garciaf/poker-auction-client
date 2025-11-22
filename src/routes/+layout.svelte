<script>
  import '../app.css';
  import LiveNavigation  from '$lib/liveNavigation';
  import PlayerTag from '$lib/components/PlayerTag.svelte';
  import Notifications from '$lib/components/Notifications.svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import HelpPanel from '$lib/components/HelpPanel.svelte';
  import { base } from '$app/paths'; // ✅ use base path from SvelteKit
  import { locale } from '$lib/i18n';
  import { localePreference } from '$lib/stores/locale';
  import { onMount } from 'svelte';
  import { playerStore } from '$lib/stores/player';
  import { isHelpPanelOpen } from '$lib/stores/help';

  // Sync locale with persisted preference
  onMount(() => {
    const unsubscribe = localePreference.subscribe(value => {
      locale.set(value);
    });
    return unsubscribe;
  });

  function toggleHelpPanel() {
    isHelpPanelOpen.update(value => !value);
  }
</script>

<svelte:head>
  <title>Shaddy poker</title>
  <link rel="icon" type="image/svg+xml" href="{base}/images/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</svelte:head>

<main class="bg-poker-green h-dvh text-white overflow-auto">
  <header class="px-5 py-3 flex justify-between items-center shadow-xl" style={`background-color: ${$playerStore.color};`}>
    <PlayerTag />
    <LanguageSwitcher />
  </header>
  <Notifications />
  <HelpPanel />

  <!-- Help button -->
  <button
    onclick={toggleHelpPanel}
    class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-poker-green border-2 border-gold text-gold font-eight-bit text-2xl shadow-lg hover:bg-gold hover:text-poker-darker-green transition-all duration-200 z-50"
    aria-label="Help"
  >
    ?
  </button>

  <slot />
</main>