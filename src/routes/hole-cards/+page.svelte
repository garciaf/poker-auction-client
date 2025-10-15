<script>
  import { onMount } from 'svelte';
  import socket from '$lib/socket';
  import Card from '$lib/components/Card.svelte';
  import { playerStore } from '$lib/stores/player';
  // @ts-ignore
  /**
     * @type {number | undefined}
     */
  let amount = undefined;
  let currentBid = 0;
  let flipped = false

  function flipAll() {
    flipped = !flipped
  }

  function ready() {
    if (socket) {
        socket.emit('ready');
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
  </div>
</div>

<footer class="fixed bottom-0 w-full bg-gradient-to-t from-poker-dark-green to-transparent backdrop-blur-sm py-10">
    <div class="flex flex-col items-center">
    <button class="btn" on:click={ready}>Ready</button>
  </div>
</footer>