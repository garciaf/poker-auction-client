<script lang="ts">
  import { asset } from '$app/paths';
  import type { Joker } from '$lib/stores/player';
  import { mappingJokerKeyToAsset } from '$lib/stores/player';
  export let onClick: (() => void) | undefined = undefined;
  export let joker: Joker; 

  $: front = asset(`/images/${mappingJokerKeyToAsset[joker.key]}`);
</script>

<button
  on:click={onClick}
  aria-label={`${joker.description}`}
  class="bg-transparent border-none p-0 cursor-pointer transition-transform active:scale-95 hover:scale-105"
  class:opacity-50={!joker.allowed && !joker.passive}
  class:cursor-not-allowed={!joker.allowed}
  disabled={!joker.allowed}
>
  <div
    class="relative w-24 h-24 image-pixelated"
  >
    <img
      src={front}
      alt="Front"
      class="absolute w-full h-full"
      class:grayscale={!joker.allowed && !joker.passive}
    />
    {#if joker.passive}
      <!-- Works on its own while held: a gold shield badge instead of the red X -->
      <div class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gold flex items-center justify-center shadow">
        <svg class="w-5 h-5 text-poker-darker-green" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 L20 5 L20 11 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11 L4 5 Z" />
        </svg>
      </div>
    {:else if !joker.allowed}
      <!-- Red X overlay -->
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="w-20 h-20 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </div>
    {/if}
  </div>
</button>