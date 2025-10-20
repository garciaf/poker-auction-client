## Poker Auction Client — AI assistant instructions

This file contains concise, actionable guidance for code-editing AI agents working on the poker-auction-client SvelteKit app.

Keep edits small and focused. This repo is a client-only SvelteKit app that connects to a WebSocket backend. Key concerns are runtime-only browser code, persisted stores, small UI components, and build artifacts in `build/`.

- Project type: SvelteKit (TypeScript, Svelte 5) with TailwindCSS. Entry points and configs: `svelte.config.js`, `vite.config.ts`, `package.json`.
- Dev scripts: `npm run dev` (vite dev), `npm run build` (vite build), `npm run preview` (preview built app). `npm run check` runs `svelte-check`.

Important files and folders
- `src/lib/socket.ts` — single WebSocket wrapper. Use this to understand event shape and how messages are sent. It uses `import.meta.env.VITE_WEBSOCKET_URL` and updates `playerStore` on connect/reconnect.
- `src/lib/stores/` — custom stores:
  - `localStorageStore.ts` — helper for browser-only persisted stores (prevents storage feedback loops). Use its `setProp`, `removeProp`, `reset` helpers.
  - `player.ts` — defines `playerStore`, `gameStore`, `lotsStore`, etc. Uses `svelte-persisted-store` and is the canonical shape for player and game state.
- `src/routes/` — UI pages. Layout lives in `src/routes/+layout.svelte` which imports `LiveNavigation` and the global `app.css`.
- `build/` — output of `npm run build` and the static deploy artifacts. Do not edit generated files.

Architecture & data flow (big picture)
- Single-page SvelteKit app with client-only runtime for sockets. The WebSocket lifecycle is managed in `src/lib/socket.ts` and is instantiated only in the browser (guarded by Svelte's `browser`).
- Shared state is stored in Svelte stores under `src/lib/stores/`. `playerStore` holds the current player's id, lobbyId, name, color, balance and hole cards. `socket.emit(...)` packages messages with `{ event, data, from, to, lobbyId }`.
- UI pages observe stores and react to events. When socket receives messages it invokes registered callbacks (via `socket.on`) and components update stores accordingly.

Conventions and patterns to follow
- Browser-only checks: when working with code that accesses `window` or `localStorage`, use SvelteKit's `browser` from `$app/environment` or snapshot code to run only client-side. Example: `if (!browser) return writable(initialValue)` (see `localStorageStore.ts`).
- Persisted stores: The project mixes `svelte-persisted-store` (`player.ts`) and a custom `localStorageStore`. Prefer existing patterns — add new persisted state only when necessary and follow the same helper names (`setProp`, `removeProp`, `reset`).
- WebSocket messages: Use the event payload shape expected by `src/lib/socket.ts`. When you add new events, register listeners via `socket.on('eventName', cb)` and emit using `socket.emit('eventName', payload, to?)`.
- Names and paths: use `$lib` alias to import shared modules (example: `import { playerStore } from '$lib/stores/player'`). Keep imports type-safe.

Environment variables
- The frontend expects a WebSocket URL in `VITE_WEBSOCKET_URL` (accessed as `import.meta.env.VITE_WEBSOCKET_URL` in `src/lib/socket.ts`).
- Build `base` path is driven by `process.env.BASE_PATH` in `svelte.config.js` — preserve that when testing preview builds or deployments.

Developer workflows & debugging tips
- Start dev server: `npm run dev`. This runs Vite and serves the app with HMR.
- Build for production: `npm run build` -> output in `build/`. Preview with `npm run preview`.
- Type checking: `npm run check` runs `svelte-check --tsconfig ./tsconfig.json`.
- Socket debugging: The socket wrapper logs connect/disconnect, emits, and parse errors to console. Use the browser console to inspect inbound/outbound messages and the `playerStore` contents.

Tests and linting
- There are no automated tests or linters in this repo. When adding tests, prefer lightweight unit tests for stores and socket logic.

What to change (rules for AI edits)
- Small PRs only: modify one feature or component at a time. Avoid broad refactors without the developer's sign-off.
- Respect generated files: do not edit files under `build/`.
- Preserve runtime guards: do not move browser-only logic to server context.
- When changing store shapes, update all callers: searches for `.id`, `.lobbyId`, `.hole_cards`, etc., must be updated.

Examples from the codebase
- Add a socket listener in components:

  const socket = (await import('$lib/socket')).default; // socket is only present in browser
  socket?.on('player:update', (data) => playerStore.setProp('balance', data.balance));

- Emit a message from UI code:

  import socket from '$lib/socket';
  socket?.emit('lot:bid', { amount, lotId });

Quick file references
- WebSocket wrapper: `src/lib/socket.ts`
- Persisted stores: `src/lib/stores/player.ts` and `src/lib/stores/localStorageStore.ts`
- Layout and global styles: `src/routes/+layout.svelte`, `src/app.css`
- Vite config: `vite.config.ts`, `svelte.config.js`

If you need more context
- Read `src/lib/socket.ts` and `src/lib/stores/player.ts` first. These two files capture the majority of runtime behaviour and message contracts.

If you update this file
- Merge intelligently: if a `.github/copilot-instructions.md` already exists, preserve its unique guidance and merge new runtime details above. Keep this file concise (20-50 lines). After edits, ping the maintainer for validation.

Questions for the maintainer
- Are there any backend message contracts (event names and payloads) documented elsewhere that should be included? If so, add a small section mapping event -> payload.

---
End of file.
