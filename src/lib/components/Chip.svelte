<script lang="ts">
    import { playerStore } from '$lib/stores/player';
    import { t } from '$lib/i18n';
    import ChipBadge from '$lib/components/ChipBadge.svelte';
</script>
<div class="flex items-center justify-center p-4">
  <!-- The player's chips: a chip in their colour with how many they have -->
  <div class="flex flex-col items-center text-center font-eight-bit">
    <div class="text-sm opacity-80 uppercase tracking-wider mb-2">{$t('common.yourChips')}</div>
    <ChipBadge amount={$playerStore.balance} color={$playerStore.color} size="5rem" />
  </div>
</div>
