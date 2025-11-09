<script lang="ts">
  import { localePreference } from '$lib/stores/locale';
  import { availableLocales } from '$lib/i18n';
  import type { LocaleCode } from '$lib/i18n';

  function switchLanguage(code: LocaleCode) {
    localePreference.set(code);
  }
</script>

<div class="flex gap-2">
  {#each availableLocales as { code, flag, name }}
    <button
      type="button"
      onclick={() => switchLanguage(code)}
      class="px-3 py-2 rounded-lg transition-all duration-200 {$localePreference === code ? 'bg-white/20 ring-2 ring-white' : 'bg-white/10 hover:bg-white/15'}"
      title={name}
    >
      <span class="text-base">{name}</span>
    </button>
  {/each}
</div>
