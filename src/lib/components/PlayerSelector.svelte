<script lang="ts">
  import type { GamePlayer } from '$lib/stores/player';
  import { t } from '$lib/i18n';

  export let players: GamePlayer[];
  export let onSelect: (playerId: string) => void;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {#each players as player}
    <button
      on:click={() => onSelect(player.id)}
      class="flex items-center gap-4 p-4 bg-black/20 rounded-xl border-2 transition-all hover:bg-black/30 hover:scale-102 active:scale-98"
      style="border-color: {player.color};"
    >
      <div
        class="w-12 h-12 rounded-full flex items-center justify-center font-eight-bit text-xl text-white"
        style="background-color: {player.color};"
      >
        {player.name.charAt(0).toUpperCase()}
      </div>
      <span class="font-eight-bit text-white text-lg truncate flex-1">
        {player.name}
      </span>
    </button>
  {/each}
</div>

{#if players.length === 0}
  <p class="text-center font-eight-bit text-white/70 py-8">
    {$t('jokerMenu.noPlayersToTarget')}
  </p>
{/if}
