<script>
    import { loadingMessage } from '$lib/stores/player';
    import HoleCards from '$lib/components/HoleCards.svelte'
</script>

<div class="flex flex-col items-center justify-center h-full text-white p-8 space-y-8">
  <HoleCards />
  <h1 class="text-5xl font-eight-bit text-white text-center">{ $loadingMessage.message }</h1>
</div>