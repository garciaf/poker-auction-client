<script lang="ts">
  import { asset } from '$app/paths';
  import { cardMappingSuit, cardMappingRank, cardNameByValue } from '$lib/cardHelper';
  export let suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' = 'HEARTS';
  export let rank = 2;
  // FLUID: as wide as its grid cell (at most NORMAL), keeping the card's shape.
  export let size: 'SMALL' | 'NORMAL' | 'FLUID'
  export let extraClass=""
  export let onClick: (() => void) | undefined = undefined;

  $: front = asset(`/images/card${cardMappingSuit[suit]}${cardMappingRank[rank]}.png`);
  const sizeClasses = { SMALL: "w-14 h-20", NORMAL: "w-24 h-36", FLUID: "w-full max-w-24 aspect-[2/3]" }
  let cardClass = sizeClasses[size]
</script>
<button 
    class={`${cardClass} ${extraClass}`} 
    onclick={onClick}
    aria-roledescription="select card"
    >
    <img
        src={front}
        alt={cardNameByValue(rank, suit) }
        class="w-full h-full image-pixelated"
    />
</button>