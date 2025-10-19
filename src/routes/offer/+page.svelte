<script>
  import { base } from '$app/paths';
  import socket from '$lib/socket';
  import Card from '$lib/components/Card.svelte';
  import {  auctionState, playerStore } from '$lib/stores/player';
  
  let flipped = false

  function flipAll() {
    flipped = !flipped
  }
  /**
     * @param {{ preventDefault: () => void; }} event
     */
  function newOffer(event) {
    event.preventDefault();
    // @ts-ignore
    if (socket) {
      socket.emit('new-offer', {});
    }
  }
</script>


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <div class="flex gap-6 perspective-1000">
      {#each $playerStore.hole_cards as card}
        <Card
          suit={card.suit}
          rank={card.rank}
          {flipped}
        />
      {/each}
    </div>
      <!-- Flip button -->
    <button
      on:click={flipAll}
      class="btn btn-primary"
    >
      {flipped ? 'Flip Back' : 'Flip Cards'}
    </button>
    <button on:click={newOffer} class="btn">
      Buy Now
    </button>
  </div>
</div>
