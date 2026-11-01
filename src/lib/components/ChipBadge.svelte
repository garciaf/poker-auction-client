<script lang="ts">
  /**
   * An amount of chips: a casino chip with the number in its middle, like the
   * chips on the main screen. There is no currency, chips are the unit.
   * The chip is in its owner's colour (a player's colour), black when nobody
   * owns it (a price). The number shrinks to stay inside the chip's inner
   * circle: one or two digits share the same size, longer numbers get smaller.
   * Art: great-auction-poker-night/tools/designs/chipsSingle.svg.
   */
  import { NO_OWNER_COLOR, chipFontSize } from '$lib/chips';

  export let amount: number | string;
  /** The owner's colour (any CSS colour); empty for nobody's chip. */
  export let color: string | null | undefined = NO_OWNER_COLOR;
  /** Width of the chip (any CSS length). */
  export let size = '4rem';

  $: text = String(amount ?? '');
</script>

<div
  class="chip-badge"
  style:--chip-size={size}
  style:color={color || NO_OWNER_COLOR}
  role="img"
  aria-label={text}
>
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <!-- body (the owner's colour), notches, inner ring -->
    <path fill="currentColor" d="m 4.25,48.05 8.3,-4.8 C 10.583333,39.916667 9.6,36.166667 9.6,32 H 0 C 0,26.066667 1.4166667,20.733333 4.25,16 l 8.3,4.8 c 0.966667,-1.633333 2.183333,-3.183333 3.649999,-4.65 1.433333,-1.433333 2.966667,-2.633333 4.6,-3.6 L 16,4.25 C 20.733333,1.4166667 26.066666,0 32,0 v 9.6 c 4.166667,0 7.916667,0.983333 11.25,2.95 l 4.799999,-8.3 c 2.333333,1.3666667 4.533333,3.0833333 6.6,5.15 2.066667,2.033333 3.783334,4.233333 5.15,6.6 l -8.35,4.8 c 1.966667,3.333333 2.95,7.066667 2.95,11.2 H 64 c 0,5.933333 -1.4,11.283333 -4.200001,16.05 l -8.35,-4.8 c -0.966667,1.633333 -2.166667,3.166667 -3.6,4.6 -1.433333,1.433333 -2.966667,2.633333 -4.6,3.6 l 4.8,8.35 c -4.766667,2.8 -10.116667,4.2 -16.05,4.2 v -9.6 c -4.133333,0 -7.866667,-0.983333 -11.2,-2.95 l -4.8,8.35 C 13.633332,58.433333 11.433333,56.716667 9.4,54.65 7.3333333,52.583333 5.6166667,50.383333 4.25,48.05 M 23.449999,47 c -1.266667,-0.766667 -2.45,-1.7 -3.55,-2.8 -1.133333,-1.133333 -2.066667,-2.316667 -2.8,-3.55 -1.533333,-2.566667 -2.3,-5.45 -2.3,-8.65 0,-3.166667 0.766667,-6.016667 2.3,-8.55 0.733333,-1.266667 1.666667,-2.45 2.8,-3.55 1.1,-1.133333 2.283333,-2.066667 3.55,-2.8 5.026327,-3.082813 12.036652,-3.084596 17.2,0 1.233333,0.733333 2.416667,1.666667 3.55,2.8 1.1,1.1 2.033333,2.283333 2.8,3.55 0,0 2.2,5.416667 2.2,8.55 0,3.2 -0.733333,6.083333 -2.2,8.65 l -2.8,3.55 c -1.133333,1.1 -2.316667,2.033333 -3.55,2.8 -2.566667,1.466667 -5.45,2.2 -8.65,2.2 -3.133333,0 -5.983333,-0.716667 -8.55,-2.15 V 47" />
    <path fill="#ffffff" d="M 4.25,16 Q 6.3,12.45 9.4,9.4 12.45,6.3 16,4.25 l 4.799999,8.3 Q 18.35,14 16.199999,16.15 14,18.35 12.549999,20.8 L 4.25,16 M 32,0 q 8.899999,0 16.049999,4.25 L 43.25,12.55 Q 38.25,9.6 32,9.6 V 0 M 59.799999,16 Q 64,23.1 64,32 h -9.600001 q 0,-6.2 -2.95,-11.2 l 8.35,-4.8 m 0,32.05 q -2.1,3.5 -5.15,6.6 -3.1,3.1 -6.6,5.15 L 43.25,51.45 q 2.45,-1.45 4.6,-3.6 2.15,-2.15 3.6,-4.6 l 8.35,4.8 M 32,64 q -8.9,0 -16,-4.2 l 4.8,-8.35 q 5,2.95 11.2,2.95 V 64 M 4.25,48.05 Q 0,40.9 0,32 h 9.6 q 0,6.25 2.95,11.25 l -8.3,4.8" />
    <path fill="#ffffff" d="m 15.35,22.4 q 1.25,-2.1 3.1,-3.95 1.85,-1.85 3.949999,-3.1 4.25,-2.55 9.600001,-2.55 5.35,0 9.649999,2.55 Q 43.75,16.6 45.6,18.45 q 1.85,1.85 3.1,3.95 2.5,4.3 2.5,9.6 0,5.35 -2.5,9.65 -1.25,2.1 -3.1,3.95 -1.85,1.85 -3.950001,3.1 Q 37.35,51.2 32,51.2 q -5.3,0 -9.600001,-2.5 -2.1,-1.25 -3.949999,-3.1 -1.85,-1.85 -3.1,-3.95 -2.55,-4.3 -2.55,-9.65 0,-5.3 2.55,-9.6 M 47,23.45 Q 45.85,21.55 44.2,19.9 42.5,18.2 40.65,17.1 36.8,14.8 32,14.8 q -4.8,0 -8.55,2.3 -1.9,1.1 -3.55,2.8 -1.7,1.65 -2.8,3.55 -2.3,3.8 -2.3,8.55 0,4.8 2.3,8.65 1.1,1.85 2.8,3.55 1.65,1.65 3.55,2.8 H 23.4 l 0.05,0.05 q 3.85,2.15 8.55,2.15 4.8,0 8.65,-2.2 1.85,-1.15 3.55,-2.8 L 47,40.65 q 2.2,-3.85 2.2,-8.65 0,-4.7 -2.15,-8.55 L 47,23.4 v 0.05" />
  </svg>
  <span class="chip-amount" style:font-size="{chipFontSize(text)}cqw">{text}</span>
</div>

<style>
  .chip-badge {
    position: relative;
    width: var(--chip-size);
    aspect-ratio: 1;
    flex-shrink: 0;
    container-type: inline-size;
    filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.4));
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .chip-amount {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    /* The digits sit on the baseline, above the font's descent: centre them. */
    padding-top: 0.1em;
    line-height: 1;
    font-family: var(--font-eight-bit);
    color: #ffffff;
    text-shadow:
      0.07em 0 0 #120d09,
      -0.07em 0 0 #120d09,
      0 0.07em 0 #120d09,
      0 -0.07em 0 #120d09;
    pointer-events: none;
  }
</style>
