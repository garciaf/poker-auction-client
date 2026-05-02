<script lang="ts">
  import { onMount } from 'svelte';
  import socket from '$lib/socket';
  import { gameStore, playerStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';
  import { readLobbyIdFromUrl } from '$lib/utils';

  let lobbyId = readLobbyIdFromUrl() ?? '';
  let selectedPlayerId: string | null = null;

  function requestRejoin(data: any) {
    socket!.joinLobby(lobbyId);
    socket!.emit('request-rejoin', { lobbyId });
  }
  
  socket?.on('connected', requestRejoin);


  function confirmSelection() {
    if (socket && selectedPlayerId) {
      socket.emit('player-rejoined-as', { playerId: selectedPlayerId, lobbyId, from: socket.getPlayerId() });
    }
  }
</script>

<div class="layout-content space-y-8 p-4">
  <div class="flex flex-col items-center text-center">
    <p class="text-white font-eight-bit rounded-full bg-white/10 px-8 py-4">{lobbyId}</p>
  </div>

  <div class="max-w-lg mx-auto p-4 mb-8 space-y-8">
    <p class="text-sm md:text-lg text-white font-eight-bit">{$t('messages.selectPlayerToRejoin')}</p>

    <ul class="space-y-4">
      {#each $gameStore.players as player}
        <li>
          <button
            class="w-full text-left text-white font-eight-bit rounded-lg bg-white/10 px-4 py-2 border-4 transition-all"
            style="border-color: {player.color}; {selectedPlayerId === player.id ? `box-shadow: 0 0 0 3px ${player.color}` : ''}"
            onclick={() => selectedPlayerId = player.id}
          >
            {player.name}
          </button>
        </li>
      {/each}
    </ul>

    <div class="flex gap-3">
      <button
        class="flex-[2] btn btn-primary"
        onclick={confirmSelection}
        disabled={!selectedPlayerId}
      >
        {$t('common.confirm')}
      </button>
    </div>
  </div>
</div>
