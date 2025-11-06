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
</svelte:head>

<main class="bg-poker-green h-dvh text-white overflow-auto">
  <PlayerTag />
  <header class="flex justify-end p-4">
    <LanguageSwitcher />
  </header>
  <Notifications />
  <div class= "h-full">
    <slot />
  </div>
</main>