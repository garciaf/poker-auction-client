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

<div class="flex flex-col items-center gap-y-8 text-center layout-content p-4">
    <p class="text-white font-eight-bit rounded-full bg-white/10 px-8 py-4"> { $playerStore.lobbyId } </p>
    <p class="text-sm md:text-lg text-white font-eight-bit">{$t('messages.gameStartsWhenReady')}</p>
</div>

<div>
  <ul class="grid grid-cols-3 gap-4 p-4 mb-8">    
    {#each $gameStore.players as player}
      <li class="col-span-3 md:col-span-1 md:col-start-2 text-lg flex  items-center"> 
        <div class="text-white font-eight-bit rounded-lg bg-white/10 px-4 py-2 border-4" style="border-color: {player.color};">
          {player.name}
        </div>
      </li>
    {/each}
  </ul>
</div>

<div class="flex flex-col items-center">
  <button class="btn" onclick={start}>{$t('common.start')}</button>
</div>
