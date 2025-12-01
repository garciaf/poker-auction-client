<script lang="ts">
    import { playerStore } from '$lib/stores/player';
</script>
  <h1 
    class="text-white text-3xl w-1/2 uppercase font-eight-bit truncate text-ellipsis"
    style="text-shadow: 0 2px 4px rgba(0,0,0,0.3);"
  >
    { $playerStore.name }
  </h1>

