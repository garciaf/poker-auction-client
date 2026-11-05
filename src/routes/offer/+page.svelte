<script>
  import socket from '$lib/socket';
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


<div class="h-full flex flex-col overflow-y-auto p-3 gap-3">
  <div class="flex-1 flex flex-col items-center justify-center gap-4">
    <HoleCards />
    <p class="text-xl font-eight-bit text-center">{$t('actions.lookTheScreen')}</p>
  </div>
  <div class="w-full max-w-md mx-auto shrink-0">
    <button onclick={newOffer} class="btn btn-primary btn-hero">
      {$t('actions.buyNow')}
    </button>
  </div>
</div>
