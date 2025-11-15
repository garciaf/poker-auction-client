<script>
    import socket from '$lib/socket';
    import { playerStore, gameStore } from '$lib/stores/player';

    import LiveNavigation from '$lib/liveNavigation';
    import { t } from '$lib/i18n';

    function start() {
        if (socket) {
            socket.emit('ready');
        }
    }
</script>

<div class="layout-content space-y-8 p-4">
  <dic class="flex flex-col items-center  text-center">
    <p class="text-white font-eight-bit rounded-full bg-white/10 px-8 py-4"> { $playerStore.lobbyId } </p>
  </dic>
  <div class="max-w-lg mx-auto p-4 mb-8 space-y-8">
    <p class="text-sm md:text-lg text-white font-eight-bit">{$t('messages.gameStartsWhenReady')}</p>
    <ul class="space-y-4">    
      {#each $gameStore.players as player}
        <li class="col-span-3 md:col-span-1 md:col-start-2 text-lg flex  items-center"> 
          <div class="text-white font-eight-bit rounded-lg bg-white/10 px-4 py-2 border-4" style="border-color: {player.color};">
            {player.name}
          </div>
        </li>
      {/each}
    </ul>
    <div class="flex gap-3">
      <button class="flex-[2] btn btn-primary" onclick={start}>{$t('common.start')}</button>
    </div>
  </div>
</div>