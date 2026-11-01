// Chips are the game's only unit: amounts are shown as a chip (ChipBadge.svelte)
// in their owner's colour, black when nobody owns them (prices). Same rules as
// the main screen (great-auction-poker-night: components/chip_badge).

/** Colour of a chip nobody owns (a price): the game's ChipBadge.NO_OWNER_COLOR. */
export const NO_OWNER_COLOR = '#1f1f24';

/** Diameter of the chip's inner circle (inside the white ring), as a fraction of its width. */
const INNER_CIRCLE = 34.4 / 64;
// Eight Bit Dragon is monospaced: a digit is 0.7em wide and 0.9em tall.
const DIGIT_WIDTH = 0.7;
const DIGIT_HEIGHT = 0.9;
/** The number's outline (text-shadow in ChipBadge.svelte) on each side, in em. */
const OUTLINE = 0.07;

/**
 * Font size of a chip's number, in percent of the chip's width (cqw), so the
 * whole text stays inside the inner circle. One digit is as big as two, so the
 * number doesn't jump in size from 9 to 10.
 */
export function chipFontSize(text: string): number {
  const length = Math.max(2, text.length);
  const width = DIGIT_WIDTH * length + 2 * OUTLINE;
  const height = DIGIT_HEIGHT + 2 * OUTLINE;
  return (INNER_CIRCLE * 100) / Math.hypot(width, height);
}
