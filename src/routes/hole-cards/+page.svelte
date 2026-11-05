<script>
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte'
  import { t } from '$lib/i18n';

  function ready() {
    if (socket) {
        socket.emit('ready');
    }
  }

</script>


<div class="h-full flex flex-col overflow-y-auto p-3 gap-3">
  <div class="flex-1 flex flex-col items-center justify-center gap-3 text-center">
    <div>
      <h2 class="text-2xl font-eight-bit font-bold mb-1">{$t('holeCards.yourHoleCards')}</h2>
      <div class="text-sm opacity-70 font-eight-bit">{$t('holeCards.privateCarsForYou')}</div>
    </div>
    <HoleCards />
    <p class="font-eight-bit text-sm">{$t('holeCards.tapBellow')}</p>
  </div>
  <div class="flex w-full max-w-lg mx-auto shrink-0">
    <button class="btn flex-[2]" onclick={ready}>{$t('actions.startAuction')}</button>
  </div>
</div>
