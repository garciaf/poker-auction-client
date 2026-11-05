<script lang="ts">
  import { onDestroy } from 'svelte';
  import socket from '$lib/socket';
  import ChipBadge from '$lib/components/ChipBadge.svelte';
  import SaleJoker from '$lib/components/SaleJoker.svelte';
  import { shopStore, playerStore, notifications, type Joker } from '$lib/stores/player';
  import { t } from '$lib/i18n';

  // The game confirms a purchase by sending the player's updated jokers
  // ("update-jokers"): when one more joker of that kind shows up, it's bought.
  // No update within this time means the purchase didn't go through.
  const PURCHASE_TIMEOUT_MS = 4000;
  const FEEDBACK_MS = 2500;

  let pending: Record<string, { before: number; timer: ReturnType<typeof setTimeout> }> = {};
  let justBought: Record<string, boolean> = {};
  let failed: Record<string, boolean> = {};

  $: owned = countByKey($playerStore.jokers);
  $: for (const key of Object.keys(pending)) {
    if ((owned[key] ?? 0) > pending[key].before) confirmPurchase(key);
  }

  function countByKey(jokers: Joker[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const joker of jokers ?? []) counts[joker.key] = (counts[joker.key] ?? 0) + 1;
    return counts;
  }

  function canAfford(joker: Joker, balance: number): boolean {
    return balance >= joker.price;
  }

  // Some jokers can only be held a few at a time (the game checks it too).
  function atLimit(joker: Joker, counts: Record<string, number>): boolean {
    return !!joker.maxPerPlayer && (counts[joker.key] ?? 0) >= joker.maxPerPlayer;
  }

  function buyJoker(joker: Joker) {
    if (pending[joker.key] || !canAfford(joker, $playerStore.balance) || atLimit(joker, owned)) return;
    failed = { ...failed, [joker.key]: false };
    pending = {
      ...pending,
      [joker.key]: {
        before: owned[joker.key] ?? 0,
        timer: setTimeout(() => failPurchase(joker.key), PURCHASE_TIMEOUT_MS),
      },
    };
    socket?.emit('buy', { key: joker.key });
  }

  function confirmPurchase(key: string) {
    clearTimeout(pending[key].timer);
    const { [key]: _done, ...rest } = pending;
    pending = rest;
    justBought = { ...justBought, [key]: true };
    setTimeout(() => (justBought = { ...justBought, [key]: false }), FEEDBACK_MS);
    navigator.vibrate?.(60);
    const joker = $shopStore.jokers.find((j: Joker) => j.key === key);
    const message = $t('shop.boughtToast', { name: joker?.name ?? key });
    notifications.update((n) => [...n, { message, author: $t('shop.title') }]);
    setTimeout(() => notifications.update((n) => n.filter((notif) => notif.message !== message)), 3000);
  }

  function failPurchase(key: string) {
    if (!pending[key]) return;
    const { [key]: _done, ...rest } = pending;
    pending = rest;
    failed = { ...failed, [key]: true };
    setTimeout(() => (failed = { ...failed, [key]: false }), FEEDBACK_MS);
  }

  onDestroy(() => Object.values(pending).forEach((p) => clearTimeout(p.timer)));
</script>


<div class="h-full flex flex-col p-3">
  <div class="max-w-lg md:max-w-2xl mx-auto w-full flex flex-col min-h-0 flex-1">
    <!-- Pinned shop header -->
    <div class="mb-3 shrink-0">
      <div class="text-2xl font-eight-bit uppercase tracking-wider">{$t('shop.title')}</div>
    </div>
    <!-- Scrollable joker list -->
    <div class="flex flex-col space-y-4 flex-1 min-h-0 overflow-y-auto">
      {#each $shopStore.jokers as joker}
        <div class="bg-black/20 rounded-xl transition-shadow duration-300" class:bought-glow={justBought[joker.key]}>
          <div class= "p-6">
            <div class="relative">
              <div class="flex flex-col item-center justify-center mb-6">
                <!-- The price: a chip nobody owns (black), like on the main screen -->
                <div class="absolute -top-5 -right-5 z-10">
                  <ChipBadge amount={joker.price} size="4.5rem" />
                </div>
                <!-- Room for the price chip on both sides, so the text stays centred -->
                <div class="text-center mb-4 px-14">
                  <h2 class="text-2xl font-eight-bit font-bold mb-1"> { joker.name}</h2>
                  <div class="text-sm opacity-70 font-eight-bit"> { joker.description }</div>
                  {#if joker.maxPerPlayer}
                    <div class="text-xs text-gold font-eight-bit mt-1">{$t('shop.limitHint', { max: joker.maxPerPlayer })}</div>
                  {/if}
                </div>
                <div class="flex justify-center relative" class:bought-pop={justBought[joker.key]}>
                  <SaleJoker
                    joker={ joker }
                    />
                  {#if owned[joker.key]}
                    <div class="absolute bottom-0 right-0 bg-poker-darker-green border-2 border-gold rounded px-2 py-1 text-xs font-eight-bit text-gold">
                      {#if joker.maxPerPlayer}
                        {$t('shop.ownedOf', { count: owned[joker.key], max: joker.maxPerPlayer })}
                      {:else}
                        {$t('shop.owned', { count: owned[joker.key] })}
                      {/if}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
          <div class="w-full flex">
            <button
              onclick={() => buyJoker(joker)}
              class="flex-[2] btn-cta rounded-t-none"
              class:btn-bought={justBought[joker.key]}
              class:btn-failed={failed[joker.key]}
              class:animate-pulse={pending[joker.key]}
              disabled={!!pending[joker.key] || !canAfford(joker, $playerStore.balance) || atLimit(joker, owned)}
              aria-live="polite"
            >
              {#if pending[joker.key]}
                {$t('shop.buying')}
              {:else if justBought[joker.key]}
                <span class="inline-flex items-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" shape-rendering="crispEdges"><path d="M13 3h2v2h-1v1h-1v1h-1v1h-1v1h-1v1H9v1H8v1H7v1H5v-1H4v-1H3V9H2V7h2v1h1v1h1v1h1V9h1V8h1V7h1V6h1V5h1V4h1z"/></svg>
                  {$t('shop.bought')}
                </span>
              {:else if failed[joker.key]}
                {$t('shop.failed')}
              {:else if atLimit(joker, owned)}
                {$t('shop.limitReached')}
              {:else if !canAfford(joker, $playerStore.balance)}
                {$t('shop.notEnough')}
              {:else}
                {$t('actions.buyFor', { price: joker.price })}
              {/if}
            </button>  
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .bought-glow {
    box-shadow: 0 0 0 4px #fbbf24, 0 0 28px rgba(251, 191, 36, 0.6);
  }
  .bought-pop {
    animation: bought-pop 0.5s ease-out;
  }
  @keyframes bought-pop {
    0% { transform: scale(1); }
    40% { transform: scale(1.12) rotate(-3deg); }
    100% { transform: scale(1); }
  }
  .btn-bought {
    background-color: #16a34a;
    color: white;
  }
  .btn-failed {
    background-color: #b91c1c;
    color: white;
  }
  button:disabled:not(.btn-bought) {
    opacity: 0.6;
  }
</style>
