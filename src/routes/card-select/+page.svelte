<script lang="ts">
  import socket from '$lib/socket';
  import Card from '$lib/components/Card.svelte';
  import SmallCard from '$lib/components/SmallCard.svelte';
  import { lotsStore, playerStore,  } from '$lib/stores/player';
  import type { Card as CardType } from '$lib/cardHelper';
  import { t } from '$lib/i18n';
  let selectedCard: CardType;
  // The lot can hold any number of cards (3 in 2D, 4 in 3D): one row up to 4,
  // then two balanced rows. Cards shrink to fit the phone's width.
  const MAX_COLUMNS = 4;
  $: cardCount = $lotsStore.cards.length;
  $: columns = cardCount <= MAX_COLUMNS ? Math.max(cardCount, 1) : Math.ceil(cardCount / 2);
  function confirmSelection(selectedCard: CardType): void {
    if(selectedCard){
      socket?.emit('select-card', { card: selectedCard })
    }
  }
</script>
<div class="h-full flex flex-col p-4">
  <div class="max-w-lg mx-auto w-full flex flex-col min-h-0 flex-1">
    <!-- Pinned top: your hole cards + title + info -->
    <div class="shrink-0">
      <div class="bg-black/20 rounded-xl p-3 mb-3">
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
      <div class="text-center mb-3">
        <div class="text-2xl font-eight-bit mb-1">
          {$t('actions.selectCard')}
        </div>
      </div>
    </div>

    <!-- Scrollable card grid + confirm button -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="flex justify-center mb-3">
        <div
          class="grid w-full justify-center gap-2 sm:gap-3 px-3 pb-3 pt-6 bg-black/20 rounded-xl"
          style="grid-template-columns: repeat({columns}, minmax(0, 6rem));"
        >
          {#each $lotsStore.cards as card}
            <SmallCard
              suit={card.suit}
              size="FLUID"
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
</div>