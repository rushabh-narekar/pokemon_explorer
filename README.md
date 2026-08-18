# Pokémon Explorer

Browse [PokéAPI](https://pokeapi.co/) in the browser: flip through the catalog, look up a species by name or number, and star the ones you want to keep.

Built with Next.js App Router, RTK Query for the interactive catalog, and Redux for favorites saved to `localStorage`.

## Features

- Featured Pokémon on the home page (server-rendered)
- Catalog with pagination, search, and A→Z / Z→A sort
- Detail pages with stats, abilities, species info, and artwork
- Favorites that survive a reload
- Loading, empty, not-found, and error states throughout

## Stack

Next.js 16 · React 19 · TypeScript (strict) · Tailwind v4 · Redux Toolkit + RTK Query · Vitest · Playwright

## Requirements

Node.js 20+ and npm 10+. No `.env` file needed.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm run start
```

## Tests and checks

```bash
npm run test        # unit + component
npm run test:e2e    # Playwright (run once: npx playwright install chromium)
npm run lint
npm run type-check
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run test` | Unit + component tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |

## Project layout

```
app/           Routes and route-level loading/error UI
components/    UI pieces and small client islands
lib/pokeapi/   Fetch helpers, types, mappers
store/         Redux store, RTK Query API, favorites slice
tests/         unit/, component/, e2e/
docs/          ARCHITECTURE.md, TRADE_OFFS.md
```

## Server vs client

| Route | Renders on | Data |
| --- | --- | --- |
| `/` | Server | `getPokemonSummaries` |
| `/pokemon` | Client (`CatalogPage`) | RTK Query |
| `/pokemon/[name]` | Server | `getPokemon` + `getPokemonSpecies` |
| `/favorites` | Server shell + client list | Redux / localStorage |
| `/about` | Server | Static |

Redux mounts once in `StoreProvider`. Server Components never call RTK Query hooks or touch `localStorage`.

## RTK Query (`store/pokemon-api.ts`)

Two endpoints:

1. **`getPokemonCatalogPage`** — paginated list, then detail for up to 20 cards on that page
2. **`getPokemonByNameOrId`** — exact lookup when searching

Cache tags: `Catalog:{offset}-{limit}` and `Pokemon:{nameOrId}`. Entries stick around for ~30s before a background refetch; unused cache is dropped after 5 minutes.

## Caching

- **Server:** `fetch` with `revalidate: 86400` (24 hours)
- **Client:** RTK Query slice cache
- **Sort / filter:** runs on whatever is already loaded — no extra API calls

## Favorites

Stored under the key `pokemon-explorer-favorites` in `localStorage`, synced from a Redux slice after the client hydrates. The server always renders an empty list first so there is no hydration mismatch.

## Prefetch

Nav links use default Next.js prefetch. Catalog cards prefetch detail routes for the first four visible cards only. `/about` has prefetch turned off.

## PokéAPI usage

- Page size capped at 20
- No full-dex download
- At most one list request + twenty detail requests per catalog page
- Server routes revalidate daily to avoid hammering the API

## Accessibility

Skip link, landmarks, labeled form controls, visible focus rings, stat values as text (not color-only), artwork fallback when an image fails.

## Known gaps

- Search is exact match only (name or id)
- Sort applies to the current page, not the whole dex
- Favorites are per-browser, not synced across devices
- Evolution chain is a link out, not an in-app tree
- No type filter yet

## Future improvements

Prefetch on card focus, a type filter scoped to the current page, favorite export/import, and static pages for a few popular species. Nothing here is started — see `docs/TRADE_OFFS.md` for the reasoning.

## Trade-offs

I skipped fuzzy search, global type filters, evolution trees, and offline mode to keep API usage predictable and the codebase small enough to review in one sitting. Details in `docs/TRADE_OFFS.md`.

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — why things are split the way they are
- [`docs/TRADE_OFFS.md`](docs/TRADE_OFFS.md) — what got cut and what I'd add next
