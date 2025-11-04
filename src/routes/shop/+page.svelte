<script lang="ts">
  import socket from '$lib/socket';
  import Chip from '$lib/components/Chip.svelte';
  import Joker from '$lib/components/Joker.svelte';
  import { shopStore } from '$lib/stores/player';
  import { playerStore } from '$lib/stores/player';

  function buyJoker(joker: any) {
    socket?.emit('buy', {key: joker.key,});
  }
</script>


<div class="layout-content space-y-8 lg:px-4 py-12">
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
    <Chip />  
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      {#each $playerStore.jokers as joker }
        <Joker
          joker={ joker}
        />
      {/each}
    </div>
  </div>
  <h2 class="text-white text-2xl font-[700] text-center"> Select a joker to buy </h2>
  <div class= "flex flex-col items-center justify-center items-center gap-y-4 text-center">
      {#each $shopStore.jokers as joker}
        <h2> { joker.name}</h2>
        <Joker
          joker={ joker}
          onClick={() => buyJoker(joker)}
        />
        <p> { joker.description }</p>
      {/each}
  </div>
</div>
