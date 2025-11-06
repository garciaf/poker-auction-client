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


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <HoleCards />
  </div>
</div>

<footer class="fixed bottom-0 w-full bg-gradient-to-t from-poker-dark-green to-transparent backdrop-blur-sm py-10">
    <div class="flex flex-col items-center">
    <button class="btn" onclick={ready}>{$t('common.ready')}</button>
  </div>
</footer>