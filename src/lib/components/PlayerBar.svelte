<script lang="ts">
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { playerStore } from '$lib/stores/player';
  import { isMenuOpen } from '$lib/stores/menu';
  import { t } from '$lib/i18n';
  import ChipBadge from '$lib/components/ChipBadge.svelte';
  import JokerMenuTrigger from '$lib/components/JokerMenuTrigger.svelte';

  // Before the game starts there is no player to show yet, only the menu.
  const NO_PLAYER_ROUTES = ['/', '/lobby', '/reconnect'];
  const NO_CHIP_ROUTES = [...NO_PLAYER_ROUTES, '/waiting-room'];

  const route = $derived(page.url.pathname.slice(base.length).replace(/\/$/, '') || '/');
</script>

<header
  class="h-16 flex items-center gap-2 shrink-0 px-3 bg-poker-darker-green border-b-4"
  style:border-bottom-color={$playerStore.color}
>
  {#if !NO_PLAYER_ROUTES.includes(route)}
    {#if !NO_CHIP_ROUTES.includes(route)}
      <ChipBadge amount={$playerStore.balance} color={$playerStore.color} size="3rem" />
    {/if}
    <h1
      class="min-w-0 text-xl uppercase font-eight-bit truncate text-white"
      style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);"
    >
      {$playerStore.name}
    </h1>
  {/if}
  <div class="flex items-center gap-2 ml-auto shrink-0">
    <JokerMenuTrigger />
    <button
      onclick={() => isMenuOpen.set(true)}
      class="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 border-2 border-white/30 text-white active:scale-95"
      aria-label={$t('common.menu')}
    >
      <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" shape-rendering="crispEdges">
        <path d="M1 2h14v2H1zM1 7h14v2H1zM1 12h14v2H1z" />
      </svg>
    </button>
  </div>
</header>
