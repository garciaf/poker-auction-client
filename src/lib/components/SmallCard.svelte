<script lang="ts">
  import { base } from '$app/paths';
  import { cardMappingSuit, cardMappingRank } from '$lib/cardHelper';
  export let suit: 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES' = 'HEARTS';
  export let rank = 2;
  export let size: 'SMALL' | 'NORMAL'
  export let extraClass=""
  export let onClick: (() => void) | undefined = undefined;

  $: front = `${base}/images/card${cardMappingSuit[suit]}${cardMappingRank[rank]}.png`;
  let cardClass = size == 'SMALL' ? "w-14 h-20" : "w-24 h-36"
</script>
<button 
    class={`${cardClass} ${extraClass}`} 
    onclick={onClick}
    aria-roledescription="select card"
    >
    <img
        src={front}
        alt={cardMappingRank[rank] + ' of ' + suit }
        class="w-full h-full"
    />
</button>