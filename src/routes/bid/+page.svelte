<script lang="ts">
  import { base } from '$app/paths';
  import socket from '$lib/socket';
  import Card from '$lib/components/Card.svelte';
  import Chip from '$lib/components/Chip.svelte';
  import { playerStore } from '$lib/stores/player';
  // @ts-ignore
  /**
     * @type {number | undefined}
     */
  let amount: Number;
  let currentBid = 0;
  let flipped = false

  function flipAll() {
    flipped = !flipped
  }
  /**
     * @param {{ preventDefault: () => void; }} event
     */
  function newBid(event: Event) {
    event.preventDefault();
    // @ts-ignore
    if (socket && amount && amount > 0) {
      socket.emit('new-bid', {
        amount: amount,
      });
    }
    amount = 0; // Reset the input field after submitting the bid
  }

  if (socket) {
    socket.on('current-bid', (data) => {
      currentBid = data.current_bid || 0;
    });
  }
</script>


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <Chip />  
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
    <form on:submit={newBid} class="bg-transparent btn-width">
      <div class="flex items-center bg-zinc-900 rounded-full border border-zinc-700 px-4 py-2 w-full">
        <!-- Number Input -->
        <div class="grow pr-4 justify-start">
          <div class="flex items-center justify-start px-2 lg:px-4">  
            <input
              type="number"
              name="amount"
              inputmode="numeric"
              bind:value={amount}
              step="1"
              placeholder="$ 2200"
              class="bg-transparent border border-transparent focus:border-transparent focus:ring-0 text-white text-lg font-bold outline-none w-24 text-left w-full"
            />

          </div>
        </div>
    
        <!-- Submit Button -->
        <button
          type="submit"
          class="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-poker-darker-green to-poker-green shadow-inner"
          aria-label="Submit Bid"
        >
          <img src={`${base}/images/arrow.svg`} alt="Arrow" class="w-6 h-6" />
        </button>
      </div>
    </form>
  </div>
</div>
