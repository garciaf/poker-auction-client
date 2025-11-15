import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { browser } from '$app/environment';
import socket from '$lib/socket';
import { playerStore, lotsStore, shopStore, updateJokerStatus, bonusStore, notifications } from '$lib/stores/player';
// @ts-ignore
import { gameStore, loadingMessage } from '$lib/stores/player';

class LiveNavigation {
  constructor() {
    this.onRefresh();

    socket?.on('change-screen', (data) => {
      if (data.screen === 'loading') {
        loadingMessage.set({ message: data.message || "Loading..." });
        goto(`${base}/loading`);
      } else if (data.screen === 'skip') {
        goto(`${base}/skip`);
      } else if (data.screen === 'open-auction') {
        goto(`${base}/bid`);
      } else if (data.screen === 'silent-auction') {
        goto(`${base}/bid`);
      } else if (data.screen === 'dutch-auction') {
        goto(`${base}/offer`);
      } else if (data.screen === 'result') {
        goto(`${base}/result`);
      } else if(data.screen === 'finance') {
        const { bonus } = data
        bonusStore.set({ amount: bonus })
        goto(`${base}/finance`);

      } else if (data.screen === 'card-select') {
        lotsStore.set({ cards: data.cards || [] });
        goto(`${base}/card-select`);
      } else if (data.screen === 'hole-cards') {
        const hole_cards = data.hole_cards || [];
        const jokers = data.jokers || []
        playerStore.update(current => ({ ...current, hole_cards, jokers }));
        goto(`${base}/hole-cards`);
      } else if (data.screen === 'shop') {
        const jokers = data.jokers || []
        shopStore.set({ jokers: jokers })
        goto(`${base}/shop`)
      }
    });

    socket?.on('update-finance', (data) => {
      playerStore.update(current => ({ ...current, balance: data.balance || 0 }));
    });

    socket?.on('update-hole-cards', (data) => {
      playerStore.update(current => ({ ...current, hole_cards: data.hole_cards || [], jokers: data.jokers || [] }));
    });

    socket?.on('allowed-joker', (data) => {
      const { joker } = data;
      
      updateJokerStatus(joker.key, true)
    });
    
    socket?.on('forbid-joker', (data) => {
      const { joker } = data;
      
      updateJokerStatus(joker.key, false)
    });

    socket?.on('update-jokers', (data) => {
      playerStore.update(current => ({ ...current, jokers: data.jokers || [] }));
    })

    socket?.on('player-joined-lobby', (data) => {
      const { name, id, color, tag, avatar } = data;
      playerStore.update(state => ({...state, id, color}));

      goto(`${base}/waiting-room`); // ✅ SvelteKit navigation
  });

    socket?.on('update-player', (data) => {
      console.log('Updating player data:', data);
      const { id, lobbyId, name, balance, color, rounds_won, hole_cards, jokers } = data;
      playerStore.set({
        id,
        lobbyId: lobbyId || null,
        name: name || '',
        color: color || '',
        rounds_won: rounds_won || 0,
        balance: balance || 0,
        hole_cards: hole_cards || [],
        jokers: jokers || []
      });
    });

    socket?.on('update-players-list', (data) => {
      gameStore.set({ players: data.players });
    });

    socket?.on('new-message', (data) => {
      notifications.update((n) => {
        n.push({
          message: data.message,
          author: data.author,
        });
        return n;
      });

      setTimeout(() => {
        notifications.update((n) => n.filter((notif) => notif.message !== data.message));
      }, 3000);
    });
  }

  onRefresh() {
    if (!browser) return;

    const navEntries = performance.getEntriesByType("navigation");
    // @ts-ignore
    const navType = navEntries[0]?.type || performance.navigation?.type;

    if (navType === "reload") {
      // @ts-ignore
      socket.emit('player-reconnected', { message: 'Page was refreshed' });
    }

    if (sessionStorage.getItem('refreshing') === 'true') {
      sessionStorage.removeItem('refreshing');
    }

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('refreshing', 'true');
    });
  }
}

let liveNavigation = null;

if (browser) {
  liveNavigation = new LiveNavigation();
}

export default liveNavigation;
