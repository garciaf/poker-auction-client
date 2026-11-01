<script lang="ts">
  import { bonusStore, playerStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';
  import ChipBadge from '$lib/components/ChipBadge.svelte';
</script>


<div class="h-full flex flex-col justify-center p-4">
  <div class="max-w-lg mx-auto">
    <div class= "flex flex-col items-center mb-6 bg-black/20 rounded-xl p-4">
      <div class="text-5xl font-eight-bit uppercase">{$t('finance.title')}</div>
      <div class="flex items-center justify-center p-4">
        <div class="flex flex-col items-center text-center mb-6 font-eight-bit">
            <div class="text-sm opacity-80 uppercase tracking-wider mb-2">{$t('common.yourChips')}</div>
            <div class="flex items-center gap-3">
              <div class="text-5xl font-bold" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">+</div>
              <ChipBadge amount={Number($bonusStore.amount)} color={$playerStore.color} size="6.5rem" />
            </div>
        </div>
        </div>
    </div>
    <div class="text-center mb-4">
        <h2 class="text-2xl font-eight-bit font-bold mb-1">{$t('finance.subtitle')}</h2>
        <div class="text-sm opacity-70 font-eight-bit">{$t('finance.hint')}</div>
    </div>
  </div>
</div>
