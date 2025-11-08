<script lang="ts">
  import { base } from '$app/paths';

  export let flipped = false
  export let suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' = 'HEARTS';
  export let rank = 2;
  export let onClick: (() => void) | undefined = undefined;

  const mappingSuit = {
    'HEARTS': 'Hearts',
    'DIAMONDS': 'Diamonds',
    'CLUBS': 'Clubs',
    'SPADES': 'Spades'
  };
  const mappingRank: Record<number, string> = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K',
    14: 'A'
  };
  $: front = `${base}/images/card${mappingSuit[suit]}${mappingRank[rank]}.png`;
  $: back = `${base}/images/cardBackSimple.png`;
</script>
<button
  on:click={onClick}
  class="bg-transparent border-none p-0 cursor-pointer active:scale-95 hover:scale-105"
  aria-label="{flipped ? mappingRank[rank] + ' of ' + suit : 'Card back'}"
>
  <div
    class="relative w-24 h-36 transition-transform duration-700 transform-style-preserve-3d"
    class:rotate-y-180={flipped}
  >
    <img
      src={front}
      alt="Front"
      class="absolute w-full h-full backface-hidden shadow-xs"
    />
    <img
      src={back}
      alt="Back"
      class="absolute w-full h-full backface-hidden rotate-y-180 shadow-xs"
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
