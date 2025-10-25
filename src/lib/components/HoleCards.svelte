<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import { playerStore, isCardHidden} from '$lib/stores/player';

  function toggleCard() {
    isCardHidden.update(hidden => !hidden);
  }

</script>

<div class="flex gap-6 perspective-1000">
    {#each $playerStore.hole_cards as card}
    <Card
        suit={card.suit}
        rank={card.rank}
        flipped={$isCardHidden}
    />
    {/each}
</div>
    <!-- Flip button -->
<button
    on:click={toggleCard}
    class="btn btn-primary"
>
    {$isCardHidden ? 'Flip Back' : 'Flip Cards'}
</button>