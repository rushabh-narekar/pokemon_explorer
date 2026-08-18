import Link from "next/link";
import { getTypeStyle } from "@/lib/pokeapi/constants";
import { formatPokemonName } from "@/lib/pokeapi/normalize";
import type { PokemonSummary } from "@/lib/pokeapi/types";
import { buildDetailHref } from "@/lib/utils";
import FavoriteButton from "./FavoriteButton";
import PokemonArtwork from "./PokemonArtwork";
import PokemonTypes from "./PokemonTypes";

interface PokemonCardProps {
  pokemon: PokemonSummary;
  catalogContext?: { page?: number; search?: string; sort?: string };
  prefetch?: boolean;
}

export default function PokemonCard({
  pokemon,
  catalogContext,
  prefetch = true,
}: PokemonCardProps) {
  const href = buildDetailHref(pokemon.name, catalogContext);
  const typeStyle = getTypeStyle(pokemon.types[0]?.name ?? "normal");

  return (
    <article className="card flex h-full flex-col">
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: typeStyle.bg }} aria-hidden="true" />
      <div className="relative shrink-0">
        <Link
          href={href}
          prefetch={prefetch}
          className="card-art-link"
        >
          <PokemonArtwork
            name={pokemon.name}
            image={pokemon.image}
            aspect="wide"
            className="rounded-none bg-transparent"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />
        </Link>
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
          <FavoriteButton pokemon={pokemon} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--pokemon-gray)]">
            #{String(pokemon.id).padStart(4, "0")}
          </p>
          <h2 className="font-display break-words text-base font-bold leading-snug text-[var(--pokemon-navy)] sm:text-lg">
            <Link
              href={href}
              prefetch={prefetch}
              className="rounded-sm transition-colors duration-200 hover:text-[var(--pokemon-blue)] focus-pokemon cursor-pointer"
            >
              {formatPokemonName(pokemon.name)}
            </Link>
          </h2>
        </div>
        <div className="mt-auto pt-1">
          <PokemonTypes types={pokemon.types} size="sm" />
        </div>
      </div>
    </article>
  );
}
