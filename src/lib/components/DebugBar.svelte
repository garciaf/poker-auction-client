<script lang="ts">
  import { onMount } from 'svelte';
  import socket from '$lib/socket';

  let gameState = $state<any>(null);
  let isOpen = $state(false);
  let isLoading = $state(false);

  let screenshotImage = $state<string | null>(null);
  let isScreenshotLoading = $state(false);

  onMount(() => {
    socket?.on('game-state-update', (data: any) => {
      gameState = data;
      isLoading = false;
      isOpen = true;
    });

    socket?.on('screenshot', (data: any) => {
      screenshotImage = data.image;
      isScreenshotLoading = false;
      isOpen = true;
    });
  });

  function requestGameState() {
    isLoading = true;
    socket?.emit('game-state-requested');
  }

  function requestScreenshot() {
    isScreenshotLoading = true;
    socket?.emit('screenshot-requested');
  }
</script>

<div class="fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-yellow-400/50 font-mono text-xs">
  <div class="flex items-center gap-3 px-3 py-2">
    <span class="text-yellow-400 font-bold">⚙ DEV</span>
    <button
      onclick={requestGameState}
      disabled={isLoading}
      class="px-2 py-1 bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 rounded hover:bg-yellow-400/30 disabled:opacity-50 transition-colors"
    >
      {isLoading ? 'Loading…' : 'game-state-requested'}
    </button>
    <button
      onclick={requestScreenshot}
      disabled={isScreenshotLoading}
      class="px-2 py-1 bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 rounded hover:bg-yellow-400/30 disabled:opacity-50 transition-colors"
    >
      {isScreenshotLoading ? 'Loading…' : 'screenshot-requested'}
    </button>
    {#if gameState || screenshotImage}
      <button
        onclick={() => isOpen = !isOpen}
        class="px-2 py-1 bg-white/10 border border-white/20 text-white/70 rounded hover:bg-white/20 transition-colors"
      >
        {isOpen ? '▼ hide' : '▶ show'}
      </button>
    {/if}
    {#if gameState && !isOpen}
      <span class="text-white/40 truncate max-w-xs">{JSON.stringify(gameState).slice(0, 80)}…</span>
    {/if}
  </div>
  {#if isOpen && gameState}
    <pre class="max-h-64 overflow-auto px-3 pb-3 text-green-300/90 text-xs leading-relaxed">{JSON.stringify(gameState, null, 2)}</pre>
  {/if}
  {#if isOpen && screenshotImage}
    <div class="px-3 pb-3">
      <p class="text-yellow-400/70 mb-1">screenshot</p>
      <img
        src="data:image/jpeg;base64,{screenshotImage}"
        alt="game screenshot"
        class="max-h-40 max-w-xs rounded border border-white/10"
      />
    </div>
  {/if}
</div>
