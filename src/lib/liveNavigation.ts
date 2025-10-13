import { goto } from '$app/navigation';
import { browser } from '$app/environment';
import socket from '$lib/socket';
import { playerStore, lotsStore } from '$lib/stores/player';
// @ts-ignore
import { financeState, auctionState, gameStore, loadingMessage } from '$lib/stores/player';

class LiveNavigation {
  constructor() {
    this.onRefresh();

    socket?.on('change-screen', (data) => {
      if (data.screen === 'lot-intro') {
        goto('/lot');
      } else if (data.screen === 'loading') {
        loadingMessage.set({ message: data.message || "Loading..." });
        goto('/loading');
      } else if (data.screen === 'skip') {
        goto('/skip');
      } else if (data.screen === 'open-auction') {
        auctionState.set({
          currentBid: data.current_bid || 0,
          player: null,
        });
        goto('/bid');
      } else if (data.screen === 'silent-auction') {
        auctionState.set({
          currentBid: data.current_bid || 0,
          player: null,
        });
        goto('/bid');
      } else if (data.screen === 'dutch-auction') {
        goto('/dutch-bid');
      } else if (data.screen === 'result') {
        goto('/result');
      } else if (data.screen === 'card-select') {
        lotsStore.set({ cards: data.cards || [] });
        goto('/card-select');
      } 
    });

    socket?.on('update-finance', (data) => {
      financeState.set({ balance: data.balance || 0 });
    });

    socket?.on('update-hole-cards', (data) => {
      playerStore.setProp('hole_cards', data.hole_cards || []);
    });

    socket?.on('update-player', (data) => {
      console.log('Updating player data:', data);
      const { id, name, balance, color, rounds_won, hole_cards } = data;
      playerStore.set({ id, name, balance, color, rounds_won, hole_cards });
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
