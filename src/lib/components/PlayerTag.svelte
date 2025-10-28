<script lang="ts">
    import { playerStore } from '$lib/stores/player';
</script>
<div class="w-full flex item-center justify-center border border-b-1 border-black" style={`background-color: ${$playerStore.color};`}>
    <h1 class="text-white text-lg font-eight-bit text-outline">{ $playerStore.name }</h1>
</div>