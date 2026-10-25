<script>
  import socket from '$lib/socket';
  import Chip from '$lib/components/Chip.svelte';
  import HoleCards from '$lib/components/HoleCards.svelte'
  import { t } from '$lib/i18n';

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


<div class="h-full flex flex-col items-center justify-center p-4">
  <div class="flex flex-col items-center justify-center gap-y-3 text-center w-full">
    <Chip />
    <HoleCards />
    <div class="bg-poker-darker-green rounded-2xl p-4 mb-3 flex flex-col space-y-4 btn-width">
      <div class="text-center text-base font-eight-bit uppercase tracking-wider mb-4">{$t('actions.yourBid')}</div>
      <p class="text-xl font-eight-bit">{$t('actions.lookTheScreen')}</p>
      <div class="flex">
        
        <button onclick={newOffer} 
          class="flex-[2] btn btn-primary"
          >
          {$t('actions.buyNow')}
        </button>
      </div>
    </div>
  </div>
</div>
