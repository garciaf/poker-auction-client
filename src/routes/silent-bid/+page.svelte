<script lang="ts">
  import { onDestroy } from 'svelte';
  import socket from '$lib/socket';
  import HoleCards from '$lib/components/HoleCards.svelte';
  import Chip from '$lib/components/Chip.svelte';
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

<div class="h-full flex flex-col overflow-y-auto p-4">
  <div class="flex flex-col items-center justify-center gap-y-2 text-center">
    <div class="w-full max-w-md bg-black/30 rounded-xl p-3 border-2 border-white/15">
      <div class="text-2xl font-eight-bit uppercase tracking-wider">{$t('silentBid.title')}</div>
      <div class="text-xs opacity-80 font-eight-bit mt-1">{$t('silentBid.subtitle')}</div>
    </div>
    <Chip />
    <HoleCards />

    <div class="bg-black/20 rounded-2xl p-4 mb-3 flex flex-col space-y-4 w-full max-w-md">
      <label for="silent-bid" class="text-center text-base font-eight-bit uppercase tracking-wider">{$t('silentBid.yourBid')}</label>

      {#if $silentAuctionStore.error}
        <div role="alert" class="rounded-lg border-2 border-red bg-red/30 px-3 py-2 font-eight-bit text-sm">
          {$silentAuctionStore.error}
        </div>
      {/if}

      <div class="flex gap-3 items-stretch">
        <button
          onclick={() => adjust(-1)}
          disabled={sending}
          aria-label="-1"
          class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
          −
        </button>
        <div class="flex-1">
          <input
            type="number"
            id="silent-bid"
            inputmode="numeric"
            min={minBid}
            max={balance}
            bind:value={amount}
            disabled={sending}
            class="w-full h-[70px] border-3 rounded-lg bg-black/40 text-white text-4xl font-eight-bit text-center outline-none focus:bg-black/50"
            class:border-white={!problem}
            class:border-red={!!problem}
          >
        </div>
        <button
          onclick={() => adjust(1)}
          disabled={sending}
          aria-label="+1"
          class="w-14 rounded-lg bg-white/15 border-2 border-white/25 text-white text-2xl font-eight-bit transition-all active:bg-white/25 active:scale-95">
          +
        </button>
      </div>
      <div class="min-h-5 text-sm font-eight-bit" class:text-red-300={!!problem} class:opacity-70={!problem}>
        {problem || $t('silentBid.min', { min: minBid })}
      </div>

      <div class="grid grid-cols-4 gap-2">
        {#each [5, 10, 20] as step}
          <button
            onclick={() => adjust(step)}
            disabled={sending}
            class="h-12 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit transition-all active:bg-[#D4A574]/50 active:scale-95">
            +{step}
          </button>
        {/each}
        <button
          onclick={() => (amount = balance)}
          disabled={sending}
          class="h-12 rounded-lg bg-deep-crimson border-2 border-[#D4A574]/40 text-white font-eight-bit text-xs transition-all active:bg-[#D4A574]/50 active:scale-95">
          {$t('silentBid.allIn')}
        </button>
      </div>

      <div class="flex gap-3">
        <button
          onclick={pass}
          disabled={sending}
          class="flex-1 btn btn-danger"
          class:confirm-pass={confirmPass}
        >
          {confirmPass ? $t('silentBid.confirmPass') : $t('silentBid.pass')}
        </button>
        <button
          onclick={placeBid}
          disabled={!canBid}
          class="flex-[2] btn btn-primary"
          class:animate-pulse={sending}
        >
          {sending ? $t('silentBid.sending') : $t('silentBid.place')}
        </button>
      </div>
      <div class="text-xs opacity-60 font-eight-bit">{$t('silentBid.passHint')}</div>
    </div>
  </div>
</div>

<style>
  .confirm-pass {
    background-color: #b91c1c;
  }
</style>
