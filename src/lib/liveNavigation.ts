import { goto } from '$app/navigation';
import { base } from '$app/paths';
import { browser } from '$app/environment';
import socket from '$lib/socket';
import { playerStore, lotsStore } from '$lib/stores/player';
// @ts-ignore
import { gameStore, loadingMessage } from '$lib/stores/player';

class LiveNavigation {
  constructor() {
    this.onRefresh();

    socket?.on('change-screen', (data) => {
      if (data.screen === 'lot-intro') {
        goto(`${base}/lot`);
      } else if (data.screen === 'loading') {
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
      } else if (data.screen === 'card-select') {
        lotsStore.set({ cards: data.cards || [] });
        goto(`${base}/card-select`);
      } else if (data.screen === 'hole-cards') {
        const hole_cards = data.hole_cards || [];
        playerStore.update(current => ({ ...current, hole_cards }));
        goto(`${base}/hole-cards`);
      }
    });

    socket?.on('update-finance', (data) => {
      playerStore.update(current => ({ ...current, balance: data.balance || 0 }));
    });

    socket?.on('update-hole-cards', (data) => {
      playerStore.update(current => ({ ...current, hole_cards: data.hole_cards || [] }));
    });

    socket?.on('update-player', (data) => {
      console.log('Updating player data:', data);
      const { id, lobbyId, name, balance, color, rounds_won, hole_cards } = data;
      playerStore.set({
        id,
        lobbyId: lobbyId || null,
        name: name || '',
        color: color || '',
        rounds_won: rounds_won || 0,
        balance: balance || 0,
        hole_cards: hole_cards || []
      });
    });

    socket?.on('update-players-list', (data) => {
      gameStore.set({ players: data.players });
    });

    socket?.on('new-message', (data) => {
      // @ts-ignore
      notifications.update((n) => {
        n.push({
          message: data.message,
          author: data.author,
        });
        return n;
      });

      setTimeout(() => {
        // @ts-ignore
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
