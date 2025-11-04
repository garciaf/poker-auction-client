<script>
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte'
  import Card from '$lib/components/Card.svelte';
  import { lotsStore } from '$lib/stores/player';
</script>


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <HoleCards />
  </div>
  <h2 class="text-white text-2xl font-[700] text-center"> Select a card for the community </h2>
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <div class="grid grid-cols-3 md:grid-cols-4 gap-6">
      {#each $lotsStore.cards as card}
        <Card
          suit={card.suit}
          rank={card.rank}
          onClick={() => socket?.emit('select-card', { card })}
        />
      {/each}
    </div>
  </div>
</div>
