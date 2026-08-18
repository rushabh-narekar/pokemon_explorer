"use client";

import Link from "next/link";
import { HiTrash } from "react-icons/hi2";
import { removeFavorite } from "@/store/favorites-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectFavorites, selectFavoritesHydrated } from "@/store/favorites-slice";
import { formatPokemonName } from "@/lib/pokeapi/normalize";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonBlock } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/toast/useToast";
import PokemonArtwork from "./PokemonArtwork";
import PokemonTypes from "./PokemonTypes";

export default function FavoritesList() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const favorites = useAppSelector(selectFavorites);
  const hydrated = useAppSelector(selectFavoritesHydrated);

  if (!hydrated) {
    return (
      <div aria-hidden="true" className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-28" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Tap the star on any Pokémon card or detail page to add it here."
        actionLabel="Explore the catalog"
        actionHref="/pokemon"
      />
    );
  }

  return (
    <ul className="space-y-4">
      {favorites.map((pokemon) => (
        <li
          key={pokemon.id}
          className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href={`/pokemon/${pokemon.name}`}
            className="favorites-row-link"
          >
            <div className="h-20 w-20 shrink-0">
              <PokemonArtwork
                name={pokemon.name}
                image={pokemon.image}
                className="h-20 w-20 rounded-xl"
                sizes="80px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--pokemon-gray)]">
                #{String(pokemon.id).padStart(4, "0")}
              </p>
              <h2 className="font-display truncate text-lg font-bold text-navy">
                {formatPokemonName(pokemon.name)}
              </h2>
              <PokemonTypes types={pokemon.types} size="sm" />
            </div>
          </Link>
          <button
            type="button"
            className="btn-secondary inline-flex w-full shrink-0 items-center justify-center gap-2 sm:w-auto"
            onClick={() => {
              dispatch(removeFavorite(pokemon.id));
              toast.info("Removed from favorites", formatPokemonName(pokemon.name));
            }}
          >
            <HiTrash className="h-4 w-4" aria-hidden="true" />
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
