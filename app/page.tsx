import Link from "next/link";
import { FEATURED_POKEMON } from "@/lib/pokeapi/constants";
import { getPokemonSummaries } from "@/lib/pokeapi/client";
import PokemonCard from "@/components/pokemon/PokemonCard";

export default async function HomePage() {
  const featured = await getPokemonSummaries([...FEATURED_POKEMON]);

  return (
    <div className="space-y-12">
      <section className="hero-shell">
        <div className="relative z-10 max-w-3xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[var(--pokemon-yellow)]">
            Pokémon Explorer
          </p>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Browse the Pokédex, pick favorites, actually read the stats.
          </h1>
          <p className="mt-4 text-base leading-8 text-white/90 sm:text-lg">
            Data comes from a public Pokémon API. Search by name or number, paginate through the list, star what you like.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/pokemon" prefetch={false} className="btn-primary">
              Browse catalog
            </Link>
            <Link href="/favorites" prefetch={false} className="btn-secondary !border-white !bg-white/10 !text-white hover:!bg-white/20">
              View favorites
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-heading" className="page-title">
              Featured Pokémon
            </h2>
            <p className="mt-1 text-muted">A few classics to start with.</p>
          </div>
          <Link href="/pokemon" prefetch={false} className="btn-ghost hidden sm:inline-flex">
            View all
          </Link>
        </div>
        <ul className="pokemon-grid">
          {featured.map((pokemon, index) => (
            <li key={pokemon.id} className="flex min-w-0">
              <PokemonCard pokemon={pokemon} prefetch={index < 3} />
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-card">
        <h2 className="font-display text-lg font-bold text-navy sm:text-xl">What you can do</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Search", "Find Pokémon by name or number."],
            ["Sort & browse", "Flip through pages and sort results A–Z."],
            ["Save favorites", "Star Pokémon from cards or detail pages."],
          ].map(([title, copy]) => (
            <li
              key={title}
              className="feature-tile"
            >
              <h3 className="font-display font-bold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
