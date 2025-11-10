<script lang="ts">
  import { base } from '$app/paths';
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte'
  import Chip from '$lib/components/Chip.svelte';
  import { t } from '$lib/i18n';
  // @ts-ignore
  /**
     * @type {number | undefined}
     */
  let amount: Number | undefined;
  let currentBid = 0;
  /**
     * @param {{ preventDefault: () => void; }} event
  */
  function submitBid(event: Event) {
    event.preventDefault();
    // @ts-ignore
    if (amount && amount > 0) {
      socket?.emit('new-bid', {
        amount: amount,
      });
    }
    amount = undefined; // Reset the input field after submitting the bid
  }

  function cancelBid() {
    amount = undefined
  }

  function adjustBid(value: number) {
    let newBid
    if(amount){
      newBid = Number(amount) + value;
    } else {
      newBid = value
    }
    amount = newBid
  }
  
  socket?.on('current-bid', (data) => {
    currentBid = data.current_bid || 0;
  });
</script>


<div class="layout-content space-y-8 lg:px-4 p-4">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <Chip />  
    <HoleCards />
    
    <div class="bg-black/20 rounded-2xl p-6 mb-5 flex flex-col space-y-6">
      <label for="bid" class="text-center text-base font-eight-bit uppercase tracking-wider mb-4">{$t('actions.yourBid')}</label>
      <div class="flex gap-3 mb-5 items-stretch">
        <!-- Number Input -->
         <button 
            onclick={() => adjustBid(-1)}
            class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
            −
        </button>
        <div class="flex-1">
          <input 
              type="number"
              id="bid"
              inputmode="numeric"
              bind:value={amount}
              class="w-full h-[70px] border-3 border-white/30 rounded-lg bg-black/40 text-white text-4xl font-eight-bit text-center outline-none focus:border-[#D4A574] focus:bg-black/50"
            >
        </div>
        <button 
            onclick={() => adjustBid(1)}
            class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
            +
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">  
        <button 
          onclick={() => adjustBid(5) }
          class="h-12 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit transition-all active:bg-[#D4A574]/50 active:scale-95">
            +5
        </button>
        <button 
            onclick={() => adjustBid(10)}
            class="h-12 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit transition-all active:bg-[#D4A574]/50 active:scale-95">
            +10
        </button>
        <button 
            onclick={() => adjustBid(20)}
            class="h-12 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit transition-all active:bg-[#D4A574]/50 active:scale-95">
            +20
        </button>
      </div>
        <!-- Submit Button -->
      <div class="flex gap-3">
        <button
          onclick={cancelBid}
          class="flex-1 btn btn-danger"
          aria-label={$t('actions.cancel')}
        >
          {$t('actions.cancel')}
        </button>
        <button
          onclick={submitBid}
          class="flex-[2] btn btn-primary"
          aria-label={$t('actions.submitBid')}
        >
          {$t('actions.submitBid')}
        </button>
      </div>
    </div>
  </div>
</div>
