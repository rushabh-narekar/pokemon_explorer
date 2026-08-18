# Trade-offs

Kept the scope small so the architecture stays easy to follow.

**Server vs client.** Home and detail pages stay on the server for fast first paint and smaller bundles. The catalog moved to the client because pagination, search, and cached fetches fit RTK Query well.

**API calls.** PokéAPI is public but you still shouldn't spam it. The catalog never pulls the full dex — one list call plus up to twenty detail calls per page. Server routes cache for 24 hours. Sorting reuses data already in memory, so it only affects the current page.

**Where state lives.** Server cache = Next.js revalidation. Catalog cache = RTK Query tags. Favorites = Redux mirrored to `localStorage` after hydration. That avoids a backend but means favorites don't follow you across browsers.

**UX calls.** Search accepts an exact name or id — predictable and easy to test. Stats show numbers, not just colored bars. Broken sprites fall back to text. Prefetch is limited to nav links and the first four cards.

**Left out for now.** Type filters, evolution trees, fuzzy search, offline support. See README for the full list.

**If I had more time.** Prefetch on card focus, a page-scoped type filter, favorite export/import, and static pages for a handful of popular species.
