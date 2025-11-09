<script>
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte'
  import Chip from '$lib/components/Chip.svelte';
  import { t } from '$lib/i18n';

  function ready() {
    if (socket) {
        socket.emit('ready');
    }
  }

</script>


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class="max-w-lg mx-auto p-4">
    <div class= "flex justify-between items-center mb-6 bg-black/20 rounded-xl p-4">
      <div class="text-xl md:text-5xl font-eight-bit uppercase tracking-wider">{$t('holeCards.dealing')}</div>
      <div class="text-right">
        <Chip />
      </div>
    </div>
    <div class="flex flex-col item-center justify-center mb-6">
      <div class="text-center mb-4">
        <h2 class="text-2xl font-eight-bit font-bold mb-1">{$t('holeCards.yourHoleCards')}</h2>
        <div class="text-sm opacity-70 font-eight-bit">{$t('holeCards.privateCarsForYou')}</div>
      </div>
      <HoleCards />

    </div>
    <p class="text-center font-eight-bit text-sm mb-2">{$t('holeCards.tapBellow')}</p>
    <div class="flex ">
      <button class="btn flex-[2]" onclick={ready}>{$t('actions.startAuction')}</button>
    </div>
  </div>
</div>
