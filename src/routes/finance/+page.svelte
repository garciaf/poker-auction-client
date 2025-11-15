<script lang="ts">
  import socket from '$lib/socket';
  import Chip from '$lib/components/Chip.svelte';
  import { bonusStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';
  function start() {
        if (socket) {
            socket.emit('ready');
        }
    }
</script>


<div class="layout-content space-y-8 p-4">
  <div class="max-w-lg mx-auto">
    <div class= "flex flex-col items-center mb-6 bg-black/20 rounded-xl p-4">
      <div class="text-5xl font-eight-bit uppercase">{$t('finance.title')}</div>
      <div class="flex items-center justify-center p-4">
        <div class="text-center mb-6 font-eight-bit">
            <div class="text-sm opacity-80 uppercase tracking-wider mb-2">{$t('common.yourChips')}</div>
            <div class="text-5xl font-bold" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">+ {$bonusStore.amount}</div>
        </div>
        </div>
    </div>
    <div class="text-center mb-4">
        <h2 class="text-2xl font-eight-bit font-bold mb-1">{$t('finance.subtitle')}</h2>
        <div class="text-sm opacity-70 font-eight-bit">{$t('finance.hint')}</div>
    </div>
    <div class="flex gap-3">
      <button
          onclick={() => start()}
          class="flex-[2] btn btn-primary"
          aria-label={$t('actions.submitBid')}
      >
          {$t('common.start')}
      </button>  
    </div>
  </div>
</div>
