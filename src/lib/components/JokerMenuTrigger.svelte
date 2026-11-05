<script lang="ts">
  import { jokerMenuStore } from '$lib/stores/jokerMenu';
  import { playerStore } from '$lib/stores/player';
  import { scale } from 'svelte/transition';

  $: hasJokers = $playerStore.jokers.length > 0;
  $: allowedJokerCount = $playerStore.jokers.filter(j => j.allowed).length;

  function openMenu() {
    if (hasJokers) {
      jokerMenuStore.open();
    }
  }
</script>

{#if hasJokers}
  <button
    on:click={openMenu}
    class="relative w-11 h-11 rounded-lg bg-gold border-2 border-golden-light flex items-center justify-center transition-all active:scale-95"
    class:opacity-60={allowedJokerCount === 0}
    transition:scale={{ duration: 200 }}
    aria-label="Open joker menu"
  >
    <span class="text-2xl leading-none">&#127183;</span>
    {#if allowedJokerCount > 0}
      <span class="absolute -top-1 -right-1 bg-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-eight-bit">
        {allowedJokerCount}
      </span>
    {/if}
  </button>
{/if}
