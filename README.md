# Pokémon Explorer

Next.js app backed by [PokéAPI](https://pokeapi.co/). Browse a paginated catalog, open detail pages, star favorites, and come back to them later — favorites live in the browser, not on a server.

## Features

- Home page with six featured Pokémon (server-rendered)
- Paginated catalog with live search, A→Z / Z→A sort, and URL-backed state
- Detail pages with stats, abilities, species text, and evolution chain reference
- Favorites saved to `localStorage`
- Loading, empty, error, and not-found states throughout

## Stack

Next.js 16, React 19, TypeScript, Tailwind v4, Redux Toolkit + RTK Query. Tests: Vitest + Playwright.

## Requirements

Node 20+.

## Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000. No env file needed — everything hits public PokéAPI endpoints.

```bash
npm run build && npm run start   # production
npm run test                     # unit + component
npm run test:e2e                 # browser (install once: npx playwright install chromium)
npm run lint
npm run type-check
```

## Architecture

Most pages are Server Components. Home and `/pokemon/[name]` fetch in `lib/pokeapi/client.ts` with native `fetch` and 24-hour revalidation. Detail pages request Pokémon + species together via `Promise.all`.

The catalog at `/pokemon` is a client island — pagination, search-as-you-type, and RTK Query caching are easier there. Favorites use a Redux slice written to `localStorage` after hydration.

| Route | Rendering | Data |
|---|---|---|
| `/` | Server | Featured list |
| `/pokemon` | Client island | RTK Query |
| `/pokemon/[name]` | Server | Pokémon + species in parallel |
| `/favorites` | Server shell + client list | Redux |
| `/about` | Server | Static |

Redux only wraps what needs it: catalog toolbar, favorite buttons, toasts. Server files don't import RTK hooks.

## RTK Query

Four endpoints in `store/pokemon-api.ts`:

- `getPokemonCatalogPage` — one list call + up to 20 detail calls per page
- `getPokemonByNameOrId` — lookup by name or numeric id
- `searchPokemonSummaries` — partial name match for live search
- `getPokemonNameIndex` — cached name list for suggestions (~1 hour)

Tags: `Catalog:{offset}-{limit}` and `Pokemon:{nameOrId}`. Stale data refetches after ~30s; unused cache clears after 5 minutes. No custom retry layer — failed requests surface the error UI and the user can retry manually.

## Caching & API fair use

PokéAPI is free but shared, so requests stay bounded:

- 20 Pokémon per catalog page, 6 on home
- Sort runs on data already in memory — no extra round trips
- Live search loads a name index once, filters locally, then fetches detail for matches (cap 20)
- Server routes revalidate once a day

## Favorites persistence

Redux slice + `localStorage`. Hydration happens client-side only — the server never reads browser storage. Empty favorites page has its own state.

## Prefetch

Main nav uses default Next.js Link prefetch. Catalog cards prefetch the first four detail routes on a page. Home CTA buttons skip prefetch since they're not repeated navigation.

## Accessibility

Skip link, landmarks, labels on search/sort, focus rings, stat numbers as text (not just colored bars), broken-artwork fallback, reduced-motion support in CSS.

## Known limitations

Sort only affects the current page. No type filter or evolution tree UI — detail shows the chain ID, not the full tree. Favorites don't sync across devices. Partial search covers name typing but there's no full fuzzy index.

## Future improvements

Page-scoped type filter would be the first thing I'd add. After that: evolution tree visualization, cross-device favorites with a backend, and smarter search that doesn't need a upfront name index.

## Timebox trade-offs

I prioritized the server/client split, RTK caching, and test coverage over optional features like comparison mode or route interception. The cached name index for live search is a conscious trade — one larger fetch up front instead of an API call per keystroke.

## Dev console noise

If you see `chrome-extension://` errors or hydration warnings about `bis_skin_checked`, a browser extension (VPN, ad blocker, Bitdefender) is probably modifying the page before React loads. Incognito with extensions off usually clears it.
