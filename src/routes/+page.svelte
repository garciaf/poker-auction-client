<script lang="ts">
  import { base } from '$app/paths'; // ✅ use base path from SvelteKit
  import { goto } from '$app/navigation'; // ✅ replace push() from svelte-spa-router
  import socket from '$lib/socket'; // ✅ use SvelteKit alias
  import { playerStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';

  let name = '';
  let lobbyId = '';

  // ✅ Move socket event listeners inside onMount so they don't run on SSR
  socket?.on('joined-lobby', (data) => {
    const { lobbyId, clientId } = data;
    playerStore.update(state => ({...state, lobbyId, id: clientId, name}));

    if (socket) {
      socket.emit('new-player', {
        name: name,
      });
    }
  });
  // ✅ This will only be called on client (safe)
  function joinLobby(event: Event) {
    event.preventDefault();
    playerStore.update(state => ({...state, lobbyId, name}));

    if (socket) {
      socket.emit('join-lobby', {
        lobbyId: lobbyId,
        name: name,
      });
    }
  }
</script>

<form onsubmit={joinLobby} class="flex flex-col items-center gap-y-8 text-center layout-content p-4 pb-40">
    <label for="lobby_id" class="text-xl text-white font-eight-bit">{$t('common.lobbyId')}</label>
    <input
      id="lobby_id"
      type="text"
      name="lobby_id"
      class="input-text font-eight-bit"
      bind:value={lobbyId}
      placeholder={$t('placeholders.lobbyIdExample')}
      required
    />


    <label for="player_name" class="text-xl text-white font-eight-bit">{$t('messages.welcomeAuction')}</label>
    <input
      id="name"
      type="text"
      name="player_name"
      class="input-text font-eight-bit"
      bind:value={name}
      placeholder={$t('placeholders.yourName')}
      required
    />

    <div class="flex flex-col items-center w-full">
      <button class="btn uppercase text-center" type="submit" disabled={!name || !lobbyId}>{$t('actions.joinLobby')}</button>
    </div>
</form>
