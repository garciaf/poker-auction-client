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
  import { t } from '$lib/i18n';
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
    <div class="flex flex-row gap-4">
      <LanguageSwitcher />
      <HelpPanel />
      <button
        onclick={toggleHelpPanel}
        class="px-4 py-4 bg-white/10 rounded-lg font-eight-bit border-2 border-white/30 text-white transition-all duration-200 z-50"
        aria-label="Help"
      >
        { $t("common.rules") }
      </button>
    </div>
  </header>
  <Notifications />

  <!-- Help button -->

  <slot />
</main>