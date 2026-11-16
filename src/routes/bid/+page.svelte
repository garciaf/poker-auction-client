<script lang="ts">
  import { onDestroy } from 'svelte';
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte';
  import ChipBadge from '$lib/components/ChipBadge.svelte';
  import { playerStore, openAuctionStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';

  // Open auction: the phone shows the top bid (kept up to date by the game)
  // and the player raises over it with one tap, no total to work out from the
  // TV. The phone still sends the total it saw: when two players raise at
  // once, the later one is refused ("not enough") instead of paying more than
  // they meant, and raises again over the new top bid.
  const RAISES = [1, 5, 10, 20];
  // Buttons rest after a tap until the game answers (a new top bid) or this
  // long has passed (the bid was refused: the auctioneer says why).
  const ANSWER_TIMEOUT_MS = 1500;

  let sending = $state(false);
  let answerTimer: ReturnType<typeof setTimeout> | undefined;

  const top = $derived($openAuctionStore);
  const balance = $derived($playerStore.balance);
  const nobodyLeads = $derived(!top.playerId);
  const leading = $derived(!nobodyLeads && top.playerId === $playerStore.id);

  /** While nobody leads, the smallest raise opens at the price itself. */
  function opens(step: number): boolean {
    return nobodyLeads && step === RAISES[0];
  }

  function target(step: number): number {
    return opens(step) ? top.minBid : top.currentBid + step;
  }

  function bid(amount: number) {
    if (sending || leading || amount < top.minBid || amount > balance) return;
    sending = true;
    socket?.emit('new-bid', { amount });
    clearTimeout(answerTimer);
    answerTimer = setTimeout(() => (sending = false), ANSWER_TIMEOUT_MS);
  }

  // A new top bid: the game answered. Buzz when someone else took the lead
  // from this player, so they can keep their eyes on the TV.
  let lastLeader = $openAuctionStore.playerId;
  let lastBid = $openAuctionStore.currentBid;
  $effect(() => {
    const { playerId, currentBid } = $openAuctionStore;
    if (playerId === lastLeader && currentBid === lastBid) return;
    if (lastLeader && lastLeader === $playerStore.id && playerId !== lastLeader) {
      navigator.vibrate?.([80, 60, 80]);
    }
    lastLeader = playerId;
    lastBid = currentBid;
    sending = false;
    clearTimeout(answerTimer);
  });

  onDestroy(() => clearTimeout(answerTimer));
</script>

<div class="h-full flex flex-col overflow-y-auto p-3 gap-2">
  <div class="text-center shrink-0">
    <div class="text-lg font-eight-bit uppercase tracking-wider leading-tight">{$t('openBid.title')}</div>
    <div class="text-xs opacity-80 font-eight-bit leading-tight">{$t('openBid.subtitle')}</div>
  </div>
  <div class="flex-1 flex items-center justify-center">
    <HoleCards />
  </div>

  <!-- Pinned to the bottom, under the thumb -->
  <div class="bg-black/20 rounded-2xl p-3 flex flex-col gap-2 w-full max-w-md mx-auto shrink-0 text-center">
    <!-- The top bid: what a raise goes over -->
    <div
      class="flex items-center gap-3 rounded-xl border-2 px-3 py-2 text-left font-eight-bit"
      class:border-white-25={!leading}
      class:border-gold={leading}
      class:bg-black-40={!leading}
      class:bg-gold-20={leading}
      aria-live="polite"
    >
      {#key `${top.playerId}:${top.currentBid}`}
        <div class="pop">
          <ChipBadge amount={top.currentBid} color={top.color} size="3.5rem" />
        </div>
      {/key}
      <div class="min-w-0 flex-1">
        <div class="text-sm uppercase tracking-wider leading-tight">
          {#if leading}
            {$t('openBid.youLead')}
          {:else if nobodyLeads}
            {$t('openBid.opening')}
          {:else}
            {$t('openBid.topBid')}
          {/if}
        </div>
        <div class="text-xs leading-tight truncate" class:opacity-70={nobodyLeads || leading}>
          {#if leading}
            {$t('openBid.youLeadHint')}
          {:else if nobodyLeads}
            {$t('openBid.openingHint')}
          {:else}
            <span style:color={top.color}>{$t('openBid.by', { name: top.playerName })}</span>
          {/if}
        </div>
      </div>
    </div>

    <div class="text-xs font-eight-bit opacity-70 text-right">
      {$t('openBid.balance', { balance })}
    </div>

    <!-- Raises: one tap bids the top bid plus the raise -->
    <div class="grid grid-cols-2 gap-2">
      {#each RAISES as step (step)}
        <button
          onclick={() => bid(target(step))}
          disabled={sending || leading || target(step) > balance}
          class="raise h-16 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit flex flex-col items-center justify-center leading-tight transition-all active:bg-[#D4A574]/50 active:scale-95"
        >
          <span class="text-xl">{opens(step) ? $t('openBid.open') : `+${step}`}</span>
          <span class="text-xs opacity-80">→ {target(step)}</span>
        </button>
      {/each}
    </div>
    <button
      onclick={() => bid(balance)}
      disabled={sending || leading || balance < top.minBid}
      class="btn btn-danger btn-compact"
      class:animate-pulse={sending}
    >
      {$t('openBid.allIn')} · {balance}
    </button>
  </div>
</div>

<style>
  .raise:disabled {
    opacity: 0.35;
  }
  .border-white-25 {
    border-color: rgb(255 255 255 / 0.25);
  }
  .border-gold {
    border-color: #d4a574;
  }
  .bg-black-40 {
    background-color: rgb(0 0 0 / 0.4);
  }
  .bg-gold-20 {
    background-color: rgb(212 165 116 / 0.2);
  }
  /* The top bid changed: its chip pops in. */
  .pop {
    animation: pop 250ms ease-out;
  }
  @keyframes pop {
    from {
      transform: scale(1.35);
    }
    to {
      transform: scale(1);
    }
  }
</style>
