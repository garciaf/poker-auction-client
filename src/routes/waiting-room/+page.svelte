<script>
    import socket from '$lib/socket';
    import { playerStore, gameStore } from '$lib/stores/player';
    import { t } from '$lib/i18n';

    function start() {
        if (socket) {
            socket.emit('ready');
        }
    }
</script>

<div class="h-full flex flex-col p-4">
  <div class="flex flex-col items-center text-center shrink-0 mb-4">
    <p class="text-white font-eight-bit rounded-full bg-white/10 px-8 py-4">{ $playerStore.lobbyId }</p>
  </div>

  <div class="max-w-lg mx-auto w-full flex flex-col min-h-0 flex-1">
    <p class="text-sm md:text-lg text-white font-eight-bit mb-4 shrink-0">{$t('messages.gameStartsWhenReady')}</p>

    <ul class="space-y-4 flex-1 min-h-0 overflow-y-auto mb-4">
      {#each $gameStore.players as player}
        <li class="text-lg flex items-center">
          <div class="text-white font-eight-bit rounded-lg bg-white/10 px-4 py-2 border-4" style="border-color: {player.color};">
            {player.name}
          </div>
        </li>
      {/each}
    </ul>

    <div class="flex gap-3 shrink-0">
      <button class="flex-[2] btn btn-primary" onclick={start}>{$t('common.start')}</button>
    </div>
  </div>
</div>