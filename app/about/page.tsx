import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

const architectureSections = [
  {
    title: "Server Components",
    body: (
      <>
        The landing page (<code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">/</code>) and
        detail routes (
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">/pokemon/[name]</code>) fetch
        data on the server with native{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">fetch</code> in{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">lib/pokeapi/client.ts</code>.
        Detail pages load Pokémon and species concurrently via{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">Promise.all</code>, map to
        compact domain models, and generate metadata from fetched data.
      </>
    ),
  },
  {
    title: "RTK Query catalog",
    body: (
      <>
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">/pokemon</code> uses RTK Query
        for cached remote state, pagination, exact lookup, and distinct loading vs background-fetching
        states. Each page loads at most 20 list items and fetches detail for those 20 cards only — never
        the full dataset. Cache tags: catalog pages by offset/limit, lookups by name or id.
      </>
    ),
  },
  {
    title: "Client boundaries",
    body: (
      <>
        Client Components are limited to the catalog island, favorite buttons, navigation active states,
        toasts, and the Redux provider. Server pages stay server-rendered and embed small interactive
        children rather than converting whole routes with{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">&quot;use client&quot;</code>.
        RTK Query is never used inside Server Components.
      </>
    ),
  },
  {
    title: "Caching",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Server fetch uses 24-hour revalidation for stable public Pokémon data.</li>
        <li>RTK Query caches catalog pages and lookup results in the client store.</li>
        <li>Catalog sort runs on loaded results only — no extra API calls.</li>
      </ul>
    ),
  },
  {
    title: "Favorites persistence",
    body: (
      <>
        Favorites live in a Redux slice persisted to{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">localStorage</code> after client
        hydration. Server rendering never reads browser storage, preventing hydration mismatches.
      </>
    ),
  },
  {
    title: "Prefetch",
    body: (
      <>
        Primary navigation uses default Link prefetching. Catalog cards prefetch only the first four
        visible detail routes. Prefetch on{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">/about</code> is turned off.
      </>
    ),
  },
  {
    title: "Accessibility",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Skip link, landmarks, labeled search/sort controls, and visible focus rings.</li>
        <li>Stats expose numeric text plus progressbar semantics — not color alone.</li>
        <li>Broken artwork falls back to readable identity text.</li>
        <li>Reduced-motion users skip non-essential animation.</li>
      </ul>
    ),
  },
  {
    title: "API limitations",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>PokéAPI is public and best-effort; rate limits apply in practice.</li>
        <li>Search is exact only — no fuzzy matching or server-side full-text index.</li>
        <li>Catalog sort is page-local because fetching the entire dex is out of scope.</li>
      </ul>
    ),
  },
  {
    title: "Known limitations",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Favorites are browser-local and not shared across devices.</li>
        <li>Evolution data is a reference link, not an interactive tree.</li>
        <li>No global type filter or comparison mode.</li>
      </ul>
    ),
  },
  {
    title: "Scope trade-offs",
    body: (
      <>
        Core browsing, search, and favorites came first. Evolution trees, offline mode, and global type
        filters didn&apos;t make the cut. More detail in{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">docs/TRADE_OFFS.md</code> and{" "}
        <code className="rounded bg-[var(--pokemon-cream)] px-1.5 py-0.5">docs/ARCHITECTURE.md</code>.
      </>
    ),
  },
] as const;

export default function AboutPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--pokemon-blue)]">
          Architecture notes
        </p>
        <h1 className="page-title">How this app is built</h1>
        <p className="page-lead">
          How the app fetches data, splits server and client code, and what still needs work. Pokémon
          data from{" "}
          <a
            href="https://pokeapi.co/"
            className="font-bold text-[var(--pokemon-blue)] underline-offset-2 hover:underline focus-pokemon rounded-sm"
          >
            PokéAPI
          </a>
          .
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {architectureSections.map((section) => (
          <section key={section.title} className="panel-card space-y-3">
            <h2 className="font-display text-lg font-bold text-navy">{section.title}</h2>
            <div className="text-sm leading-7 text-muted">{section.body}</div>
          </section>
        ))}
      </div>

      <section className="panel-card space-y-4">
        <h2 className="font-display text-lg font-bold text-navy">Explore the app</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pokemon" className="btn-primary">
            Browse catalog
          </Link>
          <Link href="/favorites" className="btn-secondary">
            View favorites
          </Link>
        </div>
      </section>
    </article>
  );
}
