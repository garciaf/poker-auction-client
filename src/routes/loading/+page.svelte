<script>
    import { loadingMessage } from '$lib/stores/player';
</script>

<div class="flex flex-col items-center h-full text-white p-8 space-y-8">
  <div class="justify-center items-center flex h-full flex-col">
    <h1 class="text-5xl text-golden-light uppercase mb-8">{ $loadingMessage.message }</h1>
  </div>
</div>