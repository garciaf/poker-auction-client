<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { isMenuOpen } from '$lib/stores/menu';
  import { isHelpPanelOpen } from '$lib/stores/help';
  import { localePreference } from '$lib/stores/locale';
  import { availableLocales, t } from '$lib/i18n';

  function close() {
    isMenuOpen.set(false);
  }

  function openRules() {
    close();
    isHelpPanelOpen.set(true);
  }
</script>

{#if $isMenuOpen}
  <button
    class="fixed inset-0 bg-black/60 z-[9998] cursor-default"
    transition:fade={{ duration: 200 }}
    onclick={close}
    aria-label={$t('common.close')}
  ></button>

  <div
    class="fixed bottom-0 left-0 right-0 bg-poker-darker-green rounded-t-3xl shadow-2xl z-[9999] font-eight-bit"
    transition:fly={{ y: 300, duration: 300 }}
  >
    <div class="px-6 py-4 flex justify-between items-center border-b border-white/10">
      <h2 class="text-2xl text-gold">{$t('common.menu')}</h2>
      <button onclick={close} class="text-white text-3xl leading-none" aria-label={$t('common.close')}>&times;</button>
    </div>

    <div class="p-6 flex flex-col gap-6">
      <button
        onclick={openRules}
        class="h-14 rounded-lg bg-white/10 border-2 border-white/30 text-white text-lg active:scale-95"
      >
        {$t('common.rules')}
      </button>

      <div class="flex flex-col gap-2">
        <div class="text-sm uppercase tracking-wider opacity-80">{$t('common.language')}</div>
        <div class="flex gap-2">
          {#each availableLocales as { code, name } (code)}
            <button
              onclick={() => localePreference.set(code)}
              class="flex-1 h-12 rounded-lg text-sm transition-all {$localePreference === code ? 'bg-gold text-poker-darker-green' : 'bg-white/10 text-white/70'}"
              aria-pressed={$localePreference === code}
            >
              {name}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}
