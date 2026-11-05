<script lang="ts">
  import { asset } from '$app/paths';
  import { cardMappingSuit, cardMappingRank } from '$lib/cardHelper';
  export let flipped = false
  export let suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' = 'HEARTS';
  export let rank = 2;
  export let onClick: (() => void) | undefined = undefined;
  $: front = asset(`/images/card${cardMappingSuit[suit]}${cardMappingRank[rank]}.png`);
  $: back = asset(`/images/cardBack.png`);
</script>
<button
  on:click={onClick}
  class="bg-transparent border-none p-0 cursor-pointer active:scale-95 hover:scale-105"
  aria-label="{flipped ? cardMappingRank[rank] + ' of ' + suit : 'Card back'}"
>
  <div
    class="hole-card relative transition-transform duration-700 transform-style-preserve-3d"
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
  /* Exact multiples of the 56x80 art, so the pixels stay even. */
  .hole-card {
    width: 7rem;
    height: 10rem;
  }
  @media (max-height: 600px) {
    .hole-card {
      width: 5.25rem;
      height: 7.5rem;
    }
  }
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
