<script lang="ts">
  import { base } from '$app/paths';
  import { cardMappingSuit, cardMappingRank } from '$lib/cardHelper';
  export let flipped = false
  export let suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' = 'HEARTS';
  export let rank = 2;
  export let onClick: (() => void) | undefined = undefined;
  $: front = `${base}/images/card${cardMappingSuit[suit]}${cardMappingRank[rank]}.png`;
  $: back = `${base}/images/cardBackSimple.png`;
</script>
<button
  on:click={onClick}
  class="bg-transparent border-none p-0 cursor-pointer active:scale-95 hover:scale-105"
  aria-label="{flipped ? cardMappingRank[rank] + ' of ' + suit : 'Card back'}"
>
  <div
    class="relative w-24 h-36 transition-transform duration-700 transform-style-preserve-3d"
    class:rotate-y-180={flipped}
  >
    <img
      src={front}
      alt="Front"
      class="absolute w-full h-full backface-hidden shadow-xs image-pixelated"
    />
    <img
      src={back}
      alt="Back"
      class="absolute w-full h-full backface-hidden rotate-y-180 shadow-xs image-pixelated"
    />

  </div>
</button>
<style>
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
</style>
