<script>
    import { loadingMessage } from '$lib/stores/player';
    import HoleCards from '$lib/components/HoleCards.svelte'
</script>

<div class="flex flex-col items-center h-full text-white p-8 space-y-8">
  <HoleCards />
  <div class="justify-center items-center flex h-full flex-col justify-center">
    <h1 class="text-5xl font-eight-bit text-white mb-8">{ $loadingMessage.message }</h1>
  </div>
</div>