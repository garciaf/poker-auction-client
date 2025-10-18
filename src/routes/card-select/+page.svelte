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
  <h2 class="text-white text-2xl font-[700] text-center"> Select a card for the community </h2>
  <div class= "grid grid-cols-3 items-center justify-center items-center text-center">
    {#each $lotsStore.cards as card}
      <div class="items-center flex flex-col gap-y-2">
        <Card
          suit={card.suit}
          rank={card.rank}
          flipped={false}
        />
      <button class="btn btn-primary justify-center items-center" on:click={() => socket?.emit('select-card', { card })}>
        Select
      </button>
      </div>
    {/each}
  </div>
</div>
