import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <h1 className="page-title">About this app</h1>
        <p className="page-lead">
          Notes on how the app is put together — what runs on the server, what stays on the client,
          and a few things I skipped on purpose.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Server Components</h2>
          <p className="text-sm leading-7 text-muted">
            Home and detail pages fetch on the server. You get HTML with data already in place, smaller
            client JS, and page titles generated from the fetch.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">RTK Query catalog</h2>
          <p className="text-sm leading-7 text-muted">
            The catalog needs pagination, cached pages, and separate loading vs background-fetch states.
            RTK Query handles that on the client. Each page pulls 20 list entries plus detail for those
            20 — never the full dataset at once.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Client boundaries</h2>
          <p className="text-sm leading-7 text-muted">
            Client code is limited to the catalog toolbar, favorite buttons, nav active state, toasts,
            and the Redux provider. Server pages embed those as islands instead of marking whole routes
            client-side.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Caching &amp; favorites</h2>
          <p className="text-sm leading-7 text-muted">
            Server fetch revalidates every 24 hours. Catalog cache lives in RTK Query tags. Favorites use
            Redux + localStorage after hydration so the server never reads browser storage.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Prefetch</h2>
          <p className="text-sm leading-7 text-muted">
            Main nav uses default Next.js Link prefetch. Catalog cards prefetch the first four detail
            routes on each page. Home CTAs skip prefetch — they&apos;re one-off buttons, not repeated nav.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Accessibility</h2>
          <p className="text-sm leading-7 text-muted">
            Skip link to main content, semantic landmarks, labels on search and sort, visible focus rings,
            stat numbers shown as text (not just colored bars), and alt text with a fallback when artwork
            fails to load.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">API usage</h2>
          <p className="text-sm leading-7 text-muted">
            PokéAPI is free but shared. The app keeps requests bounded: 20 Pokémon per catalog page, 6 on
            home, and a name index cached for about an hour to power live search. Sort runs on data already
            in memory. Server routes revalidate once a day.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Known limitations</h2>
          <p className="text-sm leading-7 text-muted">
            Live search matches partial names but there&apos;s no full fuzzy index. Sort only affects the
            current page. No type filter or evolution tree UI — detail pages show the chain ID only.
            Favorites don&apos;t sync across devices.
          </p>
        </section>

        <section className="panel-card space-y-3 md:col-span-2">
          <h2 className="font-display text-lg font-bold text-navy">Timebox trade-offs</h2>
          <p className="text-sm leading-7 text-muted">
            I spent time on server/client split, RTK caching, and test coverage instead of optional extras
            like comparison mode or a full evolution tree. The name index for search is a deliberate trade:
            one larger upfront fetch, then local filtering, instead of hitting the API on every keystroke.
          </p>
        </section>
      </div>

      <section className="panel-card space-y-4">
        <h2 className="font-display text-lg font-bold text-navy">Look around</h2>
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
