# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

---

## Pixel Art Color Palette

Derived from the project's existing artwork (auctioneer character, card faces, card backs, and UI). Organized in **16 colors** across 5 thematic groups. Pair colors within the same group for shading; use black for outlines.

### Backgrounds & Outlines

| Swatch | Hex | Name | Use |
|--------|-----|------|-----|
| ![#000000](https://placehold.co/24x24/000000/000000.png) | `#000000` | Pure Black | Outlines, hard shadows |
| ![#272727](https://placehold.co/24x24/272727/272727.png) | `#272727` | Charcoal | Alternate outlines, dark details |
| ![#0e1f14](https://placehold.co/24x24/0e1f14/0e1f14.png) | `#0e1f14` | Void Green | Darkest background |
| ![#1e3a27](https://placehold.co/24x24/1e3a27/1e3a27.png) | `#1e3a27` | Deep Felt | Dark green mid-tone |

### Table & Environment

| Swatch | Hex | Name | Use |
|--------|-----|------|-----|
| ![#35654d](https://placehold.co/24x24/35654d/35654d.png) | `#35654d` | Poker Felt | Table surface, environment |

### Blues — Suit & UI

| Swatch | Hex | Name | Use |
|--------|-----|------|-----|
| ![#1c398e](https://placehold.co/24x24/1c398e/1c398e.png) | `#1c398e` | Dark Navy | Shadow side of blue surfaces |
| ![#155dfc](https://placehold.co/24x24/155dfc/155dfc.png) | `#155dfc` | Royal Blue | Auctioneer suit, UI highlights |

### Reds — Card Suits & Accents

| Swatch | Hex | Name | Use |
|--------|-----|------|-----|
| ![#8b1538](https://placehold.co/24x24/8b1538/8b1538.png) | `#8b1538` | Burgundy | Dark red, shadow side |
| ![#dc143c](https://placehold.co/24x24/dc143c/dc143c.png) | `#dc143c` | Crimson | Hearts & diamonds suits, danger |

### Golds — Coins & Crowns

| Swatch | Hex | Name | Use |
|--------|-----|------|-----|
| ![#795F00](https://placehold.co/24x24/795F00/795F00.png) | `#795F00` | Dark Amber | Gold shadow, deep bronze |
| ![#d4af37](https://placehold.co/24x24/d4af37/d4af37.png) | `#D4AF37` | Antique Gold | Main gold surface |
| ![#ffd700](https://placehold.co/24x24/ffd700/ffd700.png) | `#FFD700` | Bright Gold | Gold highlight, shine |
| ![#FFDD7E](https://placehold.co/24x24/FFDD7E/FFDD7E.png) | `#FFDD7E` | Pale Gold | Specular highlight on gold |

### Skin & Card Faces

| Swatch | Hex | Name | Use |
|--------|-----|------|-----|
| ![#D4A574](https://placehold.co/24x24/D4A574/D4A574.png) | `#D4A574` | Sandy Skin | Character skin tone |
| ![#facece](https://placehold.co/24x24/facece/facece.png) | `#FACECE` | Blush | Skin highlight, card figure tints |
| ![#ffffff](https://placehold.co/24x24/ffffff/eeeeee.png) | `#FFFFFF` | Pure White | Card faces, bright lights |
