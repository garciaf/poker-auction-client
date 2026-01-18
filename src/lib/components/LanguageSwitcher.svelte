<script lang="ts">
  import { localePreference } from '$lib/stores/locale';
  import { availableLocales } from '$lib/i18n';
  import type { LocaleCode } from '$lib/i18n';
  let isOpen = false
  
  function switchLanguage(code: LocaleCode) {
    localePreference.set(code);
    isOpen = false
  }
  
  // Functions
	function toggle() {
    isOpen = !isOpen;
	}
  
  function handleClickOutside(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.lang-switcher')) {
      isOpen = false;
		}
	}
  $: currentLanguageName = availableLocales.find(l => l.code === $localePreference)?.code ?? 'en';
  
</script>
<svelte:window on:click={handleClickOutside} />

<div class="lang-switcher relative font-eight-bit">
  <button
    type="button"
    onclick={() => toggle()}
    class={`px-4 py-4 bg-white/10 rounded-full font-eight-bit border-2 border-white/30 text-white uppercase transition-all flex items-center gap-2 ${isOpen ? 'bg-white/20 border-white' : 'bg-white/10 border-white/30'}`}
    title={currentLanguageName}
  >
    <span class="text-base">{currentLanguageName}</span>
  </button>
  {#if isOpen}
    <div class="absolute top-full mt-2 bg-gray-800 rounded-lg border-2 border-white/30 shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden z-50 min-w-full">

    {#each availableLocales as { code, flag, name }}
      <button
        onclick={() => switchLanguage(code)}
        class="w-full px-4 py-2 text-left text-white hover:bg-white/20 transition-colors whitespace-nowrap">
        {name}
      </button>
    {/each}
    </div> 
  {/if}
</div>
