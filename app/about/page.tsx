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
          This page is a quick rundown of how the code is split up.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Server Components</h2>
          <p className="text-sm leading-7 text-muted">
            Home and detail pages fetch on the server. You get HTML with data in place, smaller client JS,
            and metadata generated from the fetch.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">RTK Query catalog</h2>
          <p className="text-sm leading-7 text-muted">
            The catalog needs pagination, cached pages, and separate loading vs background-fetch states.
            RTK Query handles that on the client. Each page pulls 20 list entries and detail for those 20
            — never the full dataset.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Client boundaries</h2>
          <p className="text-sm leading-7 text-muted">
            Client code is limited to the catalog toolbar, favorite buttons, nav active state, toasts, and
            the Redux provider. Server pages embed those as islands instead of marking whole routes
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
            Main nav uses default Link prefetch. Catalog cards prefetch the first four detail routes. Prefetch
            on /about is off — low payoff.
          </p>
        </section>

        <section className="panel-card space-y-3">
          <h2 className="font-display text-lg font-bold text-navy">Limitations</h2>
          <p className="text-sm leading-7 text-muted">
            Exact search only. Page-local sort. No type filter or evolution tree UI. Favorites don&apos;t
            sync across devices. Stats show numbers, not just bar colors. Broken sprites fall back to text.
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
