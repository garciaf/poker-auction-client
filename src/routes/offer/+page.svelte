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


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <Chip />
    <HoleCards />
    <button onclick={newOffer} class="btn">
      {$t('actions.buyNow')}
    </button>
  </div>
</div>
