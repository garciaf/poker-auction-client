<script lang="ts">
    import { playerStore } from '$lib/stores/player';
</script>
<div class="flex items-center justify-center p-4">
  <!-- Casino Chip -->
  <div class="text-center mb-6 font-eight-bit">
      <div class="text-sm opacity-80 uppercase tracking-wider mb-2">Your Chips</div>
      <div class="text-5xl font-bold" style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);">{$playerStore.balance}</div>
  </div>
</div>