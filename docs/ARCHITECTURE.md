# Architecture notes

## Server Components

The home page and `/pokemon/[name]` run on the server. They ship HTML with data already in place, keep client JS down, and let us generate metadata from the fetch result.

## RTK Query

The catalog at `/pokemon` is interaction-heavy — pagination, search, cached pages, background refetches. RTK Query handles that better than round-tripping the server on every click.

| Layer | Cache | Key |
| --- | --- | --- |
| Server | Next.js fetch revalidation | URL |
| Catalog pages | RTK Query tags | `Catalog:{offset}-{limit}` |
| Search lookup | RTK Query tags | `Pokemon:{nameOrId}` |

Failed requests retry once via `fetchBaseQuery`. Cached data is kept for 300s after the last subscriber leaves; stale data refetches after ~30s.

## Favorites

Redux + `localStorage`. No backend, so persistence stays in the browser. Hydration runs after mount in `StoreProvider` so the server HTML always matches the first client paint.

## Client boundaries

Client code is limited to the catalog toolbar, favorite buttons, nav active state, toasts, and the Redux provider. Server routes embed those as small islands instead of marking whole pages `"use client"`.

## Request limits

- 20 Pokémon per catalog page
- 6 featured on the home page
- No bulk fetch of the full dex
- Detail prefetch on the first four catalog cards only

## Prefetch

Default Link prefetch on main nav. Card prefetch capped at four. `/about` prefetch disabled — low payoff.

## Not built (v1)

- Fuzzy search
- Global type filter
- Evolution tree UI (external link only)
- Static generation for every species
- Offline mode beyond RTK Query defaults

## Dynamic detail routes

`/pokemon/[name]` renders on demand. Pre-building thousands of static pages would be wasted effort for this scope — the API data is stable enough that daily revalidation is fine.
