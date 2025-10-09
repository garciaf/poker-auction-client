<script>
  export let front
  export let back
  export let flipped = false
</script>

<div
  class="relative w-32 h-48 transition-transform duration-700 transform-style-preserve-3d"
  class:rotate-y-180={flipped}
>
  <img
    src={front}
    alt="Front"
    class="absolute w-full h-full backface-hidden rounded-xl shadow-lg"
  />
  <img
    src={back}
    alt="Back"
    class="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl shadow-lg"
  />
</div>

<style>
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
</style>
