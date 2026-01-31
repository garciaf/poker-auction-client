<script>
  import { connectionStatus } from '$lib/stores/player';
  import socket from '$lib/socket';
  import { fade } from 'svelte/transition';
  import { t } from '$lib/i18n';

  function retry() {
    socket?.retryReconnection();
  }
</script>

{#if !$connectionStatus.connected}
  <div
    class="fixed bottom-0 left-0 right-0 bg-red-700 text-white p-3 z-[9999] flex items-center justify-between shadow-lg"
    transition:fade={{ duration: 200 }}
  >
    <div class="flex items-center gap-3">
      {#if $connectionStatus.reconnecting}
        <div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        <span class="font-medium">
          {$t('connection.reconnecting')} ({$connectionStatus.reconnectAttempt}/{$connectionStatus.maxAttempts})
        </span>
      {:else if $connectionStatus.lastError}
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="font-medium">{$t('connection.disconnected')}: {$connectionStatus.lastError}</span>
      {:else}
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 11-1.414-1.414" />
        </svg>
        <span class="font-medium">{$t('connection.lost')}</span>
      {/if}
    </div>

    {#if !$connectionStatus.reconnecting}
      <button
        onclick={retry}
        class="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors font-medium"
      >
        {$t('connection.retry')}
      </button>
    {/if}
  </div>
{/if}
