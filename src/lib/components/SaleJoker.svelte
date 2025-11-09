<script lang="ts">
  import { base } from '$app/paths';
  import type { Joker } from '$lib/stores/player';
  export let joker: Joker; 

  const mappingJoker = {
    "sneak-peek": "joker-sneak-peek.png",
    "bid-sweep": "joker-bid-sweep.png"
  }
  $: front = `${base}/images/${mappingJoker[joker.key]}`;
</script>

<img
  src={front}
  alt="Front"
  class="w-48 h-64"
/>
