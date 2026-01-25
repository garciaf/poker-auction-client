<script lang="ts">
  import { base } from '$app/paths';
  import type { Joker } from '$lib/stores/player';
  import { mappingJokerKeyToAsset } from '$lib/stores/player';
  export let joker: Joker; 

  $: front = `${base}/images/${mappingJokerKeyToAsset[joker.key]}`;
</script>

<img
  src={front}
  alt="Front"
  class="w-48 h-64"
/>
