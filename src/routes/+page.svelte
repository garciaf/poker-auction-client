<script>
  import Card from '$lib/components/Card.svelte'

  let flipped = false

  function flipAll() {
    flipped = !flipped
  }
</script>

<div class="flex flex-col items-center gap-6 p-8">
  <!-- Two cards side by side -->
  <div class="flex gap-6 perspective-1000">
    <Card
      front="/images/cardClubs3.png"
      back="/images/cardBack.png"
      {flipped}
    />
    <Card
      front="/images/cardClubs2.png"
      back="/images/cardBack.png"
      {flipped}
    />
  </div>

  <!-- Flip button -->
  <button
    on:click={flipAll}
    class="btn btn-primary"
  >
    {flipped ? 'Flip Back' : 'Flip Cards'}
  </button>
</div>

<style>
  .perspective-1000 {
    perspective: 1000px;
  }
</style>
