<script lang="ts">
  import { base } from '$app/paths'; // ✅ use base path from SvelteKit
  import { goto } from '$app/navigation'; // ✅ replace push() from svelte-spa-router
  import socket from '$lib/socket'; // ✅ use SvelteKit alias
  import { playerStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';

  let name = '';
  let lobbyId = readLobbyIdFromUrl() ?? '';

  function readLobbyIdFromUrl(): string {
    if (typeof window === 'undefined') return '';
    const href = window.location.href; // Use pathname to get the path part of the URL
    const queryIndex = href.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = href.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      return params.get('lobbyId') ?? '';
    }
    return '';
  }

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
  <p class="text-white font-[700] rounded-full bg-white/10 px-8 py-4">{lobbyId}</p>

  <label for="player_name" class="text-lg text-white font-[400]">{$t('messages.welcomeAuction')}</label>
  <input
    id="name"
    name="player_name"
    type="text"
    class="input-text"
    bind:value={name}
    placeholder={$t('placeholders.yourName')}
    required
  />

  <footer class="fixed bottom-0 w-full bg-gradient-to-t from-poker-dark-green to-transparent backdrop-blur-sm py-10">
    <div class="flex flex-col items-center">
      <button class="btn uppercase text-center" type="submit" disabled={!name}>{$t('actions.joinLobby')}</button>
    </div>
  </footer>
</form>
