<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import socket from '$lib/socket';
  import Joker from '$lib/components/Joker.svelte';
  import { playerStore, isCardHidden} from '$lib/stores/player';

  function toggleCard() {
    isCardHidden.update(hidden => !hidden);
  }

  function useJoker(joker: any) {
    socket?.emit('use-joker', {
      key: joker.key,
    });
  }

</script>

<div class="flex justify-center gap-4 mb-8">
    {#each $playerStore.hole_cards as card}
      <Card
        suit={card.suit}
        rank={card.rank}
        flipped={$isCardHidden}
        onClick={toggleCard}
      />
    {/each}
    {#each $playerStore.jokers as joker }
      <Joker
        joker={ joker}
        onClick={() => useJoker(joker)}
      />
    {/each}
</div>