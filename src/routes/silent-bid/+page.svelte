<script lang="ts">
  import { onDestroy } from 'svelte';
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte';
  import { playerStore, silentAuctionStore } from '$lib/stores/player';
  import { t } from '$lib/i18n';

  // Silent auction: one secret bid per player. The game answers with the
  // loading screen when the bid is taken, or sends this screen again with the
  // reason when it isn't, so the player can fix the amount and try again.
  // A bid of 0 is a pass.
  const ANSWER_TIMEOUT_MS = 5000;
  const PASS_CONFIRM_MS = 3000;

  let amount: number | null = null;
  let sending = false;
  let confirmPass = false;
  let answerTimer: ReturnType<typeof setTimeout> | undefined;
  let passTimer: ReturnType<typeof setTimeout> | undefined;

  $: balance = $playerStore.balance;
  $: minBid = $silentAuctionStore.minBid ?? 1;
  $: problem =
    amount === null || amount === undefined
      ? ''
      : !Number.isInteger(Number(amount)) || amount < minBid
        ? $t('silentBid.min', { min: minBid })
        : amount > balance
          ? $t('silentBid.tooPoor', { balance })
          : '';
  $: canBid = amount !== null && amount !== undefined && problem === '' && !sending;

  // The game sent this screen again: the bid was refused. Stop waiting, keep the amount.
  let lastAnswer = $silentAuctionStore.at;
  $: if ($silentAuctionStore.at !== lastAnswer) {
    lastAnswer = $silentAuctionStore.at;
    sending = false;
    clearTimeout(answerTimer);
  }

  function send(value: number) {
    sending = true;
    socket?.emit('new-bid', { amount: value });
    clearTimeout(answerTimer);
    answerTimer = setTimeout(() => (sending = false), ANSWER_TIMEOUT_MS);
  }

  function placeBid() {
    if (canBid && amount !== null) send(Number(amount));
  }

  function pass() {
    if (sending) return;
    if (!confirmPass) {
      confirmPass = true;
      clearTimeout(passTimer);
      passTimer = setTimeout(() => (confirmPass = false), PASS_CONFIRM_MS);
      return;
    }
    confirmPass = false;
    send(0);
  }

  function adjust(value: number) {
    const next = Number(amount ?? 0) + value;
    amount = Math.max(0, Math.min(next, balance));
  }

  onDestroy(() => {
    clearTimeout(answerTimer);
    clearTimeout(passTimer);
  });
</script>

<div class="h-full flex flex-col overflow-y-auto p-3 gap-2">
  <div class="text-center shrink-0">
    <div class="text-lg font-eight-bit uppercase tracking-wider leading-tight">{$t('silentBid.title')}</div>
    <div class="text-xs opacity-80 font-eight-bit leading-tight">{$t('silentBid.subtitle')}</div>
  </div>
  <div class="flex-1 flex items-center justify-center">
    <HoleCards />
  </div>

  <!-- Pinned to the bottom, under the thumb -->
  <div class="bg-black/20 rounded-2xl p-3 flex flex-col gap-2 w-full max-w-md mx-auto shrink-0 text-center">
    {#if $silentAuctionStore.error}
      <div role="alert" class="rounded-lg border-2 border-red bg-red/30 px-3 py-1 font-eight-bit text-sm">
        {$silentAuctionStore.error}
      </div>
    {/if}
    <div class="flex justify-between items-baseline gap-2 font-eight-bit">
      <div class="text-sm uppercase tracking-wider text-left">{$t('silentBid.yourBid')}</div>
      <div class="text-xs text-right" class:text-red-300={!!problem} class:opacity-70={!problem}>
        {problem || $t('silentBid.min', { min: minBid })}
      </div>
    </div>

    <div class="flex gap-2 items-stretch">
      <button
        onclick={() => adjust(-1)}
        disabled={sending}
        aria-label="-1"
        class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
        −
      </button>
      <output
        aria-label={$t('silentBid.yourBid')}
        class="min-w-0 flex-1 h-14 flex items-center justify-center border-3 rounded-lg bg-black/40 text-3xl font-eight-bit"
        class:border-white={!problem}
        class:border-red={!!problem}
        class:text-white={!!amount}
        class:text-white-25={!amount}
      >
        {amount ?? 0}
      </output>
      <button
        onclick={() => adjust(1)}
        disabled={sending}
        aria-label="+1"
        class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
        +
      </button>
    </div>

    <div class="grid grid-cols-4 gap-2">
      {#each [5, 10, 20] as step (step)}
        <button
          onclick={() => adjust(step)}
          disabled={sending}
          class="h-11 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit transition-all active:bg-[#D4A574]/50 active:scale-95">
          +{step}
        </button>
      {/each}
      <button
        onclick={() => (amount = balance)}
        disabled={sending}
        class="h-11 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit text-xs transition-all active:bg-[#D4A574]/50 active:scale-95">
        {$t('silentBid.allIn')}
      </button>
    </div>

    <div class="flex gap-2">
      <button
        onclick={pass}
        disabled={sending}
        class="flex-1 btn btn-danger btn-compact"
        class:confirm-pass={confirmPass}
      >
        {confirmPass ? $t('silentBid.confirmPass') : $t('silentBid.pass')}
      </button>
      <button
        onclick={placeBid}
        disabled={!canBid}
        class="flex-[2] btn btn-primary btn-compact"
        class:animate-pulse={sending}
      >
        {sending ? $t('silentBid.sending') : $t('silentBid.place')}
      </button>
    </div>
  </div>
</div>

<style>
  .confirm-pass {
    background-color: #b91c1c;
  }
  .text-white-25 {
    color: rgb(255 255 255 / 0.25);
  }
</style>
