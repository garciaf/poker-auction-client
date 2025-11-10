<script lang="ts">
  import { base } from '$app/paths';
  import type { Joker } from '$lib/stores/player';
  export let onClick: (() => void) | undefined = undefined;
  export let joker: Joker; 
  
  const mappingJoker = {
    "sneak-peek": "joker-sneak-peek.png",
    "bid-sweep": "joker-bid-sweep.png"
  }
  $: front = `${base}/images/${mappingJoker[joker.key]}`;
</script>

<button
  on:click={onClick}
  aria-label={`${joker.description}`}
  class="bg-transparent border-none p-0 cursor-pointer transition-transform active:scale-95 hover:scale-105"
  class:opacity-50={!joker.allowed}
  class:cursor-not-allowed={!joker.allowed}
  disabled={!joker.allowed}
>
  <div
    class="relative w-24 h-36"
  >
    <img
      src={front}
      alt="Front"
      class="absolute w-full h-full"
      class:grayscale={!joker.allowed}
    />
    {#if !joker.allowed}
      <!-- Red X overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="w-20 h-20 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </div>
    {/if}
  </div>
</button>