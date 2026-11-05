<script lang="ts">
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte'
  import { t } from '$lib/i18n';
  let amount = $state(0);
  let currentBid = $state(0);
  /**
     * @param {{ preventDefault: () => void; }} event
  */
  function submitBid(event: Event) {
    event.preventDefault();
    if (amount > 0) {
      socket?.emit('new-bid', {
        amount: amount,
      });
    }
    amount = 0; // Reset the amount after submitting the bid
  }

  function cancelBid() {
    amount = 0
  }

  function adjustBid(value: number) {
    amount = Math.max(0, amount + value)
  }

  socket?.on('current-bid', (data) => {
    currentBid = data.current_bid || 0;
  });
</script>


<div class="h-full flex flex-col overflow-y-auto p-3 gap-3">
  <div class="flex-1 flex items-center justify-center">
    <HoleCards />
  </div>

  <!-- Pinned to the bottom, under the thumb -->
  <div class="bg-black/20 rounded-2xl p-3 flex flex-col gap-2 w-full max-w-md mx-auto shrink-0 text-center">
    <div class="text-sm font-eight-bit uppercase tracking-wider">{$t('actions.yourBid')}</div>
    <div class="flex gap-2 items-stretch">
      <button
        onclick={() => adjustBid(-1)}
        aria-label="-1"
        class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
        −
      </button>
      <output
        aria-label={$t('actions.yourBid')}
        class="min-w-0 flex-1 h-14 flex items-center justify-center border-3 border-white/30 rounded-lg bg-black/40 text-3xl font-eight-bit"
        class:text-white={amount > 0}
        class:text-white-25={amount === 0}
      >
        {amount}
      </output>
      <button
        onclick={() => adjustBid(1)}
        aria-label="+1"
        class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
        +
      </button>
    </div>
    <div class="grid grid-cols-3 gap-2">
      {#each [5, 10, 20] as step (step)}
        <button
          onclick={() => adjustBid(step)}
          class="h-11 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit transition-all active:bg-[#D4A574]/50 active:scale-95">
          +{step}
        </button>
      {/each}
    </div>
    <div class="flex gap-2">
      <button
        onclick={cancelBid}
        class="flex-1 btn btn-danger btn-compact"
        aria-label={$t('actions.cancel')}
      >
        {$t('actions.cancel')}
      </button>
      <button
        onclick={submitBid}
        class="flex-[2] btn btn-primary btn-compact"
        aria-label={$t('actions.submitBid')}
      >
        {$t('actions.submitBid')}
      </button>
    </div>
  </div>
</div>

<style>
  .text-white-25 {
    color: rgb(255 255 255 / 0.25);
  }
</style>
