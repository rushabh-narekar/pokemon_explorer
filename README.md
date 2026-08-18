# Pokémon Explorer

Small Next.js app that pulls from [PokéAPI](https://pokeapi.co/). You can browse a paginated catalog, open detail pages, star favorites, and come back to them later — favorites live in the browser, not on a server.

## What's in here

Home page shows six featured Pokémon (fetched on the server). The catalog handles pagination, live search as you type, and A→Z / Z→A sort on whatever's loaded. Detail pages pull stats, abilities, and species flavor text. There are loading, empty, error, and not-found screens so nothing just spins forever.

Built with Next.js 16, React 19, TypeScript, Tailwind v4, Redux Toolkit + RTK Query. Tests are Vitest + Playwright.

## Setup

Need Node 20+.

```bash
npm install
npm run dev
```

App runs at http://localhost:3000. No env file — it's all public PokéAPI.

Other useful commands:

```bash
npm run build && npm run start   # production
npm run test                     # unit + component
npm run test:e2e                 # browser tests (install chromium once: npx playwright install chromium)
npm run lint
npm run type-check
```

## How the code is split

I kept most pages as Server Components. Home and `/pokemon/[name]` fetch in `lib/pokeapi/client.ts` with native `fetch` and 24-hour revalidation. Detail pages request Pokémon + species at the same time via `Promise.all`.

The catalog at `/pokemon` is different — it's a client island because pagination, search-as-you-type, and RTK Query caching are easier on the client. Favorites use a Redux slice written to `localStorage` after hydration so the server never touches browser storage.

Rough map:

- `/` — server fetch for featured list
- `/pokemon` — RTK Query (`store/pokemon-api.ts`)
- `/pokemon/[name]` — server fetch, Pokémon + species in parallel
- `/favorites` — server shell, client list from Redux
- `/about` — static notes on the architecture

Redux only wraps what needs it: catalog toolbar, favorite buttons, toasts. Server files don't import RTK hooks.

## RTK Query

Two endpoints in `store/pokemon-api.ts`:

- `getPokemonCatalogPage` — one list call + up to 20 detail calls per page
- `getPokemonByNameOrId` — lookup by name or id
- `searchPokemonSummaries` — partial name match for live search (uses a cached name list)
- `getPokemonNameIndex` — name list for suggestions, cached about an hour

Tags are `Catalog:{offset}-{limit}` and `Pokemon:{nameOrId}`. Stale data refetches after ~30s; unused cache clears after 5 minutes.

## Caching and API usage

PokéAPI is free but easy to hammer, so the app is conservative:

- 20 Pokémon per catalog page, 6 on the home page
- Sort runs on data already in memory — no extra round trips for reordering
- Live search loads a name index once, then filters locally and fetches detail for matches (cap 20)
- Server routes revalidate once a day

Sort only affects the current page, not the full dex. Favorites don't sync across devices.

## Prefetch

Normal Next.js Link prefetch on nav. Catalog cards prefetch the first four detail routes on a page. `/about` has prefetch turned off — not worth it.

## Accessibility

Skip link, landmarks, labels on search/sort, focus rings, stat numbers shown as text (not just colored bars), fallback when artwork fails.

## Stuff I didn't build

Evolution tree UI, type filter, offline mode, cross-device favorites. Partial search covers name typing but there's no full fuzzy index. Fine for a take-home; I'd add a page-scoped type filter first if I had more time.

## Weird console errors in dev?

If you see `chrome-extension://` errors or hydration warnings about `bis_skin_checked`, a browser extension (VPN, ad blocker, Bitdefender) is probably modifying the page before React loads. Incognito with extensions off usually fixes it.
