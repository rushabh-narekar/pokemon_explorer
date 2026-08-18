import { formatHeight, formatPokemonName, formatWeight } from "@/lib/pokeapi/normalize";
import type { PokemonDetails, PokemonSpeciesInfo } from "@/lib/pokeapi/types";
import FavoriteButton from "./FavoriteButton";
import PokemonAbilities from "./PokemonAbilities";
import PokemonArtwork from "./PokemonArtwork";
import PokemonMeasurements from "./PokemonMeasurements";
import PokemonStats from "./PokemonStats";
import PokemonTypes from "./PokemonTypes";

interface PokemonDetailViewProps {
  pokemon: PokemonDetails;
  species: PokemonSpeciesInfo;
}

export default function PokemonDetailView({ pokemon, species }: PokemonDetailViewProps) {
  return (
    <div className="detail-layout">
      <aside className="detail-artwork-panel">
        <PokemonArtwork
          name={pokemon.name}
          image={pokemon.image}
          priority
          className="w-full rounded-xl"
        />
      </aside>

      <div className="min-w-0 space-y-6">
        <header className="panel-card detail-panel space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--pokemon-blue)]">
                #{String(pokemon.id).padStart(4, "0")}
              </p>
              <h1 className="font-display break-words text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {formatPokemonName(pokemon.name)}
              </h1>
              {species.genus ? (
                <p className="text-base text-muted sm:text-lg">{species.genus}</p>
              ) : null}
            </div>
            <FavoriteButton pokemon={pokemon} variant="pill" />
          </div>
          <PokemonTypes types={pokemon.types} />
        </header>

        <section aria-labelledby="measurements-heading" className="panel-card detail-panel">
          <h2 id="measurements-heading" className="section-heading">
            Measurements
          </h2>
          <PokemonMeasurements
            height={formatHeight(pokemon.height)}
            weight={formatWeight(pokemon.weight)}
            habitat={species.habitat}
            captureRate={species.captureRate}
          />
        </section>

        <section aria-labelledby="abilities-heading" className="panel-card detail-panel">
          <h2 id="abilities-heading" className="section-heading">
            Abilities
          </h2>
          <PokemonAbilities abilities={pokemon.abilities} />
        </section>

        <section aria-labelledby="stats-heading" className="panel-card detail-panel">
          <h2 id="stats-heading" className="section-heading">
            Base stats
          </h2>
          <PokemonStats stats={pokemon.stats} />
        </section>

        {species.description ? (
          <section aria-labelledby="species-heading" className="panel-card detail-panel">
            <h2 id="species-heading" className="section-heading">
              Species summary
            </h2>
            <p className="break-words leading-7 text-muted">{species.description}</p>
          </section>
        ) : null}

        {species.evolutionChainUrl ? (
          <section aria-labelledby="evolution-heading" className="panel-card detail-panel">
            <h2 id="evolution-heading" className="section-heading">
              Evolution
            </h2>
            <p className="text-muted">See how this Pokémon evolves in the full evolution chain.</p>
            <a
              href={species.evolutionChainUrl}
              className="btn-ghost mt-4 inline-flex !text-[var(--pokemon-blue)]"
              rel="noopener noreferrer"
              target="_blank"
            >
              View evolution chain
            </a>
          </section>
        ) : null}
      </div>
    </div>
  );
}
