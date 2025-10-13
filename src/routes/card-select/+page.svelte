<script>
  import { onMount } from 'svelte';
  import socket from '$lib/socket';
  import Card from '$lib/components/Card.svelte';
  import { playerStore, lotsStore } from '$lib/stores/player';

</script>


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <div class="flex gap-6 perspective-1000">
      {#each $playerStore.hole_cards as card}
        <Card
            suit={card.suit}
            rank={card.rank}
            flipped={false}
        />
      {/each}
    </div>
  </div>
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <div class="flex gap-6 perspective-1000">
      {#each $lotsStore.cards as card}
        <div class="items-center flex flex-col">
          Card to select:
          <Card
            suit={card.suit}
            rank={card.rank}
            flipped={false}
          />
        <button class="btn btn-primary mt-4" on:click={() => socket?.emit('select-card', { card })}>
          Select this card
        </button>
        </div>
      {/each}
    </div>
  </div>
</div>
