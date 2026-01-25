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
    class="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gold shadow-lg flex items-center justify-center z-[100] transition-all hover:scale-110 active:scale-95"
    class:opacity-60={allowedJokerCount === 0}
    transition:scale={{ duration: 200 }}
    aria-label="Open joker menu"
  >
    <span class="text-3xl">&#127183;</span>
    {#if allowedJokerCount > 0}
      <span class="absolute -top-1 -right-1 bg-red text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-eight-bit">
        {allowedJokerCount}
      </span>
    {/if}
  </button>
{/if}
