<script lang="ts">
  import { onDestroy } from 'svelte';
  import socket from '$lib/socket';
  import SmallCard from '$lib/components/SmallCard.svelte';
  import HoleCards from '$lib/components/HoleCards.svelte';
  import { voteStore } from '$lib/stores/player';
  import type { Card as CardType } from '$lib/cardHelper';
  import { t } from '$lib/i18n';

  // Table Vote: one free, secret vote per player for a card of the lot. The game
  // answers with the loading screen when the vote is taken, or sends this screen
  // again with the reason when it isn't.
  const ANSWER_TIMEOUT_MS = 5000;
  // One row up to 4 cards, then two balanced rows (as on the card-select screen).
  const MAX_COLUMNS = 4;

  let chosen: CardType | null = null;
  let sending = false;
  let answerTimer: ReturnType<typeof setTimeout> | undefined;

  $: cardCount = $voteStore.cards.length;
  $: columns = cardCount <= MAX_COLUMNS ? Math.max(cardCount, 1) : Math.ceil(cardCount / 2);

  // The game sent this screen again (a new lot, or the vote was refused): pick again.
  let lastAnswer = $voteStore.at;
  $: if ($voteStore.at !== lastAnswer) {
    lastAnswer = $voteStore.at;
    sending = false;
    chosen = null;
    clearTimeout(answerTimer);
  }

  function sameCard(a: CardType | null, b: CardType): boolean {
    return !!a && a.rank === b.rank && a.suit === b.suit;
  }

  function choose(card: CardType): void {
    if (!sending) chosen = card;
  }

  function vote(): void {
    if (!chosen || sending) return;
    sending = true;
    socket?.emit('vote-card', { card: chosen });
    clearTimeout(answerTimer);
    answerTimer = setTimeout(() => (sending = false), ANSWER_TIMEOUT_MS);
  }

  onDestroy(() => clearTimeout(answerTimer));
</script>

<div class="h-full flex flex-col overflow-y-auto p-3 gap-2">
  <div class="text-center shrink-0">
    <div class="text-lg font-eight-bit uppercase tracking-wider leading-tight">{$t('vote.title')}</div>
    <div class="text-xs opacity-80 font-eight-bit leading-tight">{$t('vote.subtitle')}</div>
  </div>
  <div class="flex justify-center shrink-0">
    <HoleCards />
  </div>

  <div class="flex-1 min-h-0 flex flex-col justify-end gap-2 w-full max-w-lg mx-auto">
    {#if $voteStore.error}
      <div role="alert" class="rounded-lg border-2 border-red bg-red/30 px-3 py-1 font-eight-bit text-sm text-center">
        {$voteStore.error}
      </div>
    {/if}
    <div
      class="grid w-full justify-center gap-2 sm:gap-3 px-3 pb-3 pt-6 bg-black/20 rounded-xl"
      style="grid-template-columns: repeat({columns}, minmax(0, 6rem));"
    >
      {#each $voteStore.cards as card (`${card.rank}-${card.suit}`)}
        <SmallCard
          suit={card.suit}
          rank={card.rank}
          size="FLUID"
          extraClass={sameCard(chosen, card) ? 'card-selectable card-selected' : 'card-selectable'}
          onClick={() => choose(card)}
        />
      {/each}
    </div>
    <button
      class="btn btn-primary btn-compact w-full shrink-0"
      class:animate-pulse={sending}
      onclick={vote}
      disabled={!chosen || sending}
    >
      {sending ? $t('vote.sending') : chosen ? $t('vote.confirm') : $t('vote.pick')}
    </button>
  </div>
</div>
