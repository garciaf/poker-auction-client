<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { playerStore, isCardHidden} from '$lib/stores/player';

  function toggleCard() {
    isCardHidden.update(hidden => !hidden);
  }
</script>

<div class="flex justify-center gap-4 mb-8">
  {#each $playerStore.hole_cards as card}
    <Card
      suit={card.suit}
      rank={card.rank}
      flipped={$isCardHidden}
      onClick={toggleCard}
    />
  {/each}
</div>