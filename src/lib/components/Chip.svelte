<script lang="ts">
    import { playerStore } from '$lib/stores/player';
</script>
<div class="flex items-center justify-center p-4">
  <!-- Casino Chip -->
  <div
    class="relative w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-2xl"
    style={`--chip-color: ${$playerStore.color};`}
  >
    <!-- Outer base -->
    <div
      class="absolute inset-0 rounded-full bg-[var(--chip-color)]
      shadow-[inset_0_6px_12px_rgba(255,255,255,0.2),_0_8px_16px_rgba(0,0,0,0.6)]"
    ></div>

    <!-- White dashed ring -->
    <div
      class="absolute inset-0 rounded-full border border-8 border-dashed
      mix-blend-screen"
    ></div>

    <!-- Inner surface -->
    <div
      class="absolute inset-[12%] rounded-full bg-[color-mix(in_srgb,var(--chip-color)_85%,black_10%)]
      shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
    ></div>

    <!-- Glossy highlight -->
    <div
      class="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/40 mix-blend-overlay"
    ></div>

    <!-- Chip Value -->
    <span class="z-10 drop-shadow-lg">{$playerStore.balance}</span>
  </div>
</div>

<style>


</style>