<script>
  import '../app.css';
  import LiveNavigation  from '$lib/liveNavigation';
  import PlayerBar from '$lib/components/PlayerBar.svelte';
  import MenuSheet from '$lib/components/MenuSheet.svelte';
  import Notifications from '$lib/components/Notifications.svelte';
  import HelpPanel from '$lib/components/HelpPanel.svelte';
  import JokerMenu from '$lib/components/JokerMenu.svelte';
  import ConnectionStatus from '$lib/components/ConnectionStatus.svelte';
  import { asset } from '$app/paths'; // ✅ use base path from SvelteKit
  import { locale } from '$lib/i18n';
  import { localePreference } from '$lib/stores/locale';
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import DebugBar from '$lib/components/DebugBar.svelte';
  // Sync locale with persisted preference
  onMount(() => {
    const unsubscribe = localePreference.subscribe(value => {
      locale.set(value);
    });
    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Shaddy poker</title>
  <link rel="icon" type="image/svg+xml" href="{asset('/images/favicon.svg')}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
</svelte:head>

<main class="bg-poker-green h-dvh text-white flex flex-col overflow-hidden">
  <PlayerBar />
  <HelpPanel />
  <MenuSheet />
  <Notifications />
  <JokerMenu />
  <ConnectionStatus />

  {#if dev}
    <DebugBar />
  {/if}

  <div class="flex-1 min-h-0">
    <slot />
  </div>
</main>