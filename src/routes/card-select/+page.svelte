<script lang="ts">
  import socket from '$lib/socket';
  import { asset } from '$app/paths';
  import SmallCard from '$lib/components/SmallCard.svelte';
  import { lotsStore, playerStore, mappingJokerKeyToAsset } from '$lib/stores/player';
  import type { Joker } from '$lib/stores/player';
  import { jokerMenuStore } from '$lib/stores/jokerMenu';
  import type { Card as CardType } from '$lib/cardHelper';
  import { t } from '$lib/i18n';
  // The cards picked for the table: 1, or 2 with Greedy Hands ($lotsStore.count).
  let selectedCards: CardType[] = [];
  // The lot can hold any number of cards (3 in 2D, 4 in 3D): one row up to 4,
  // then two balanced rows. Cards shrink to fit the phone's width.
  const MAX_COLUMNS = 4;
  $: cardCount = $lotsStore.cards.length;
  $: columns = cardCount <= MAX_COLUMNS ? Math.max(cardCount, 1) : Math.ceil(cardCount / 2);
  $: count = Math.min($lotsStore.count || 1, Math.max(cardCount, 1));
  // A new lot (after Pickpocket) or a new count (after Greedy Hands): start over.
  $: $lotsStore, (selectedCards = []);
  // Pickpocket and Greedy Hands: only the winner's phone is told they're allowed.
  $: winnerJokers = uniqueByKey($playerStore.jokers.filter(j => j.winnerOnly && j.allowed));

  function uniqueByKey(jokers: Joker[]): Joker[] {
    return jokers.filter((joker, index) => jokers.findIndex(j => j.key === joker.key) === index);
  }

  // `selected` is passed in (not read from selectedCards) so the template
  // re-renders when the selection changes.
  function isSelected(card: CardType, selected: CardType[] = selectedCards): boolean {
    return selected.some(c => c.rank === card.rank && c.suit === card.suit);
  }

  function toggle(card: CardType): void {
    if (isSelected(card)) {
      selectedCards = selectedCards.filter(c => !(c.rank === card.rank && c.suit === card.suit));
    } else if (count === 1) {
      selectedCards = [card];
    } else if (selectedCards.length < count) {
      selectedCards = [...selectedCards, card];
    }
  }

  function confirmSelection(): void {
    if (selectedCards.length === count) {
      socket?.emit('select-card', { card: selectedCards[0], cards: selectedCards })
    }
  }

  function playWinnerJoker(joker: Joker): void {
    if (joker.choose) {
      jokerMenuStore.openWith(joker);
    } else {
      socket?.emit('use-joker', { key: joker.key, target_player_id: null, cards: [] });
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
        {#if count > 1}
          <div class="text-sm font-eight-bit text-gold">
            {$t('selectCard.chooseMany', { count })}
          </div>
        {/if}
      </div>
      {#if winnerJokers.length > 0}
        <div class="flex justify-center gap-3 mb-3">
          {#each winnerJokers as joker (joker.key)}
            <button
              class="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-xl border-2 border-gold/60 active:scale-95 transition-transform"
              onclick={() => playWinnerJoker(joker)}
            >
              <img src={asset(`/images/${mappingJokerKeyToAsset[joker.key]}`)} alt="" class="w-10 h-10 image-pixelated" />
              <span class="font-eight-bit text-sm text-left">{joker.name}</span>
            </button>
          {/each}
        </div>
      {/if}
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
              extraClass={isSelected(card, selectedCards) ? 'card-selectable card-selected' : 'card-selectable'}
              onClick={() => toggle(card) }
            />
          {/each}
        </div>
      </div>
      <div class="flex gap-3">
        <button
          class="flex-[2] btn btn-primary"
          onclick={confirmSelection}
          disabled={selectedCards.length !== count}>
          { $t('common.confirm')}
        </button>
      </div>
    </div>
  </div>
</div>
