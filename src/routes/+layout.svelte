<script>
  import '../app.css';
  import LiveNavigation  from '$lib/liveNavigation';
  import PlayerTag from '$lib/components/PlayerTag.svelte';
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
</svelte:head>

<main class="bg-poker-green h-dvh text-white overflow-auto">
  <PlayerTag />
  <div class= "h-full">
    <slot />
  </div>
</main>