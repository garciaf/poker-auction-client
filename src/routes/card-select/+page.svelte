<script lang="ts">
  import socket from '$lib/socket';
  import Card from '$lib/components/Card.svelte';
  import SmallCard from '$lib/components/SmallCard.svelte';
  import { lotsStore, playerStore,  } from '$lib/stores/player';
  import type { Card as CardType } from '$lib/cardHelper';
  import { t } from '$lib/i18n';
  let selectedCard: CardType;
  function confirmSelection(selectedCard: CardType): void {
    if(selectedCard){
      socket?.emit('select-card', { card: selectedCard })
    }
  }
</script>
<div class="layout-content space-y-8 p-4">
  <div class="max-w-lg mx-auto">
    <div class="bg-black/20 rounded-xl p-3 mb-6">
      <div class="flex items-center justify-center mb-2">
        <span class="text-sm font-semibold opacity-80">{$t('selectCard.yourCard')}</span>
        <span class="text-xs opacity-60">{$t('selectCard.yourCardInfo')}</span>
      </div>
      <div class="flex justify-center gap-2">
        {#each $playerStore.hole_cards as card}
          <SmallCard
            suit={card.suit}
            rank={card.rank}
            size="SMALL"
          />
        {/each}

      </div>
    </div>
    <div class="text-center mb-6">
      <div class="text-2xl font-eight-bit mb-2">
        {$t('actions.selectCard')}
      </div>
    </div>
    <div class="bg-blue-900/40 rounded-lg p-3 border-2 border-blue-500/30  mb-4">
      <div class="flex items-center font-eight-bit justify-center gap-2 text-sm">
        {$t('selectCard.infoUseAllPlayer')}
      </div>
    </div>
    <div class= "flex justify-center gap-6 mb-6">
      <div class="grid grid-cols-3 gap-6">
        {#each $lotsStore.cards as card}
          <SmallCard
            suit={card.suit}
            size="NORMAL"
            rank={card.rank}
            extraClass={selectedCard?.rank === card.rank && selectedCard?.suit === card.suit ? 'card-selectable card-selected' : 'card-selectable'}
            onClick={() => selectedCard = card }
          />
        {/each}
      </div>
    </div>
    <div class="flex gap-3">
      <button 
        class="flex-[2] btn btn-primary" 
        onclick={() => confirmSelection(selectedCard) }
        disabled={!selectedCard}>
        { $t('common.confirm')}
      </button>
    </div>
  </div>
</div>