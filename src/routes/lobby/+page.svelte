<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation'; // ✅ replace push() from svelte-spa-router
  import socket from '$lib/socket'; // ✅ use SvelteKit alias
  import { playerStore, gameStore } from '$lib/stores/player';
  import LiveNavigation from '$lib/liveNavigation';
  import { derived } from 'svelte/store';


  let name = '';
  const lobbyId = derived(page, ($page) => $page.url.searchParams.get('lobbyId'));

  if (socket && $lobbyId) {
    // ✅ Move socket event listeners inside onMount so they don’t run on SSR
    socket.on('player-joined-lobby', (data) => {
        const { name, id, color, tag, avatar } = data;
        playerStore.setProp('id', id);
        playerStore.setProp('color', color);

        goto('/waiting-room'); // ✅ SvelteKit navigation
    });

    socket.on('joined-lobby', (data) => {
      const { lobbyId, clientId } = data;
      playerStore.setProp('lobbyId', lobbyId);
      playerStore.setProp('id', clientId);
      
      if (socket) {
        socket.emit('new-player', {
          name: $playerStore.name,
        });
      }
    });
  }

  // ✅ This will only be called on client (safe)
  function joinLobby() {
    playerStore.setProp('lobbyId', $lobbyId);
    playerStore.setProp('name', name);

    if (socket) {
      socket.emit('join-lobby', {
        lobbyId: $lobbyId,
        name: name,
      });
    }
  }
</script>

<form on:submit|preventDefault={joinLobby} class="flex flex-col items-center gap-y-8 text-center layout-content p-4 pb-40">
  <p class="text-white font-[700] rounded-full bg-white/10 px-8 py-4">{$lobbyId}</p>

  <p class="text-lg text-white font-[400]">
    Welcome to the great auction. Please choose a name before joining the lobby.
  </p>

  <input
    id="name"
    type="text"
    class="input-text"
    bind:value={name}
    placeholder="Your name"
    required
  />

  <footer class="fixed bottom-0 w-full bg-gradient-to-t from-poker-dark-green to-transparent backdrop-blur-sm py-10">
    <div class="flex flex-col items-center">
      <button class="btn uppercase text-center" type="submit" disabled={!name}>Join Lobby</button>
    </div>
  </footer>
</form>
