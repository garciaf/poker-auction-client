<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { jokerMenuStore } from '$lib/stores/jokerMenu';
  import { playerStore, gameStore } from '$lib/stores/player';
  import type { Joker } from '$lib/stores/player';
  import socket from '$lib/socket';
  import JokerCard from './Joker.svelte';
  import PlayerSelector from './PlayerSelector.svelte';
  import { t } from '$lib/i18n';

  function handleJokerSelect(joker: Joker) {
    if (!joker.allowed) return;

    if (joker.requiresTarget) {
      jokerMenuStore.selectJoker(joker);
    } else {
      activateJoker(joker, null);
    }
  }

  function handlePlayerSelect(playerId: string) {
    if ($jokerMenuStore.selectedJoker) {
      activateJoker($jokerMenuStore.selectedJoker, playerId);
    }
  }

  function activateJoker(joker: Joker, targetPlayerId: string | null) {
    socket?.emit('use-joker', {
      key: joker.key,
      target_player_id: targetPlayerId
    });
    jokerMenuStore.close();
  }

  function closeMenu() {
    jokerMenuStore.close();
  }

  function goBack() {
    jokerMenuStore.goBack();
  }

  $: otherPlayers = $gameStore.players.filter(p => p.id !== $playerStore.id);
</script>

{#if $jokerMenuStore.isOpen}
  <!-- Backdrop overlay -->
  <button
    class="fixed inset-0 bg-black/60 z-[9998] cursor-default"
    transition:fade={{ duration: 200 }}
    on:click={closeMenu}
    aria-label="Close joker menu"
  ></button>

  <!-- Bottom sheet panel -->
  <div
    class="fixed bottom-0 left-0 right-0 max-h-[80vh] bg-poker-darker-green rounded-t-3xl shadow-2xl z-[9999] overflow-auto"
    transition:fly={{ y: 500, duration: 300 }}
  >
    <!-- Header -->
    <div class="sticky top-0 bg-poker-darker-green px-6 py-4 flex justify-between items-center shadow-lg z-10 border-b border-white/10">
      {#if $jokerMenuStore.step === 'select-target'}
        <button on:click={goBack} class="text-white hover:text-gold font-eight-bit transition-colors">
          &larr; {$t('jokerMenu.back')}
        </button>
      {:else}
        <div></div>
      {/if}
      <h2 class="text-2xl font-eight-bit text-gold flex-1 text-center">
        {#if $jokerMenuStore.step === 'select-joker'}
          {$t('jokerMenu.title')}
        {:else}
          {$t('jokerMenu.selectTarget')}
        {/if}
      </h2>
      <button
        on:click={closeMenu}
        class="text-white hover:text-gold transition-colors text-3xl leading-none font-eight-bit"
        aria-label="Close"
      >
        &times;
      </button>
    </div>

    <!-- Content -->
    <div class="p-6">
      {#if $jokerMenuStore.step === 'select-joker'}
        {#if $playerStore.jokers.length === 0}
          <p class="text-center font-eight-bit text-white/70">
            {$t('jokerMenu.noJokers')}
          </p>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
            {#each $playerStore.jokers as joker}
              <div class="flex flex-col items-center gap-2">
                <JokerCard
                  {joker}
                  onClick={() => handleJokerSelect(joker)}
                />
                <div class="text-center max-w-[120px]">
                  <h4 class="font-eight-bit text-white text-sm">{joker.name}</h4>
                  <p class="font-eight-bit text-white/60 text-xs mt-1">{joker.description}</p>
                  {#if joker.requiresTarget}
                    <span class="inline-block mt-1 px-2 py-0.5 bg-gold/20 text-gold text-xs font-eight-bit rounded">
                      {$t('jokerMenu.targeted')}
                    </span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {:else if $jokerMenuStore.step === 'select-target'}
        <div class="space-y-4">
          <p class="text-center font-eight-bit text-white/80 mb-6">
            {$t('jokerMenu.selectTargetHint')}
          </p>
          <PlayerSelector
            players={otherPlayers}
            onSelect={handlePlayerSelect}
          />
        </div>
      {/if}
    </div>
  </div>
{/if}
