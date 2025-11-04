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
  class="bg-transparent border-none p-0 cursor-pointer transition-transform active:scale-95 hover:scale-105"
  aria-label={`${joker.description}`}
>
  <div
    class="relative w-32 h-48"
  >
    <img
      src={front}
      alt="Front"
      class="absolute w-full h-full"
    />
  </div>
</button>