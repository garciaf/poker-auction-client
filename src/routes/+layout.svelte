<script>
  import '../app.css';
  import LiveNavigation  from '$lib/liveNavigation';
  import PlayerTag from '$lib/components/PlayerTag.svelte';
  import Notifications from '$lib/components/Notifications.svelte';
  import { base } from '$app/paths'; // ✅ use base path from SvelteKit
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="{base}/images/favicon.svg" />
</svelte:head>

<main class="bg-poker-green h-dvh text-white overflow-auto">
  <PlayerTag />
  <Notifications />
  <div class= "h-full">
    <slot />
  </div>
</main>