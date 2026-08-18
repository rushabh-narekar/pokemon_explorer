"use client";

import { HiOutlineStar, HiStar } from "react-icons/hi2";
import {
  selectFavoritesHydrated,
  selectIsFavorite,
  toggleFavorite,
} from "@/store/favorites-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { FavoritePokemon } from "@/lib/pokeapi/types";
import { formatPokemonName } from "@/lib/pokeapi/normalize";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast/useToast";

interface FavoriteButtonProps {
  pokemon: FavoritePokemon;
  className?: string;
  label?: string;
  variant?: "icon" | "pill";
}

export default function FavoriteButton({
  pokemon,
  className,
  label,
  variant = "icon",
}: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const hydrated = useAppSelector(selectFavoritesHydrated);
  const isFavorite = useAppSelector(selectIsFavorite(pokemon.id));
  const pressed = hydrated && isFavorite;
  const displayName = formatPokemonName(pokemon.name);
  const isPill = variant === "pill";

  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={
        label ??
        (pressed
          ? `Remove ${displayName} from favorites`
          : `Add ${displayName} to favorites`)
      }
      className={cn(
        "cursor-pointer border-2 transition-all duration-200 focus-pokemon hover:scale-105 active:scale-95",
        isPill
          ? "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold"
          : "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full",
        pressed
          ? "border-[var(--pokemon-yellow-dark)] bg-[var(--pokemon-yellow)] text-[var(--pokemon-navy)] shadow-[0_2px_0_var(--pokemon-yellow-dark)] hover:bg-[#ffd633]"
          : "border-[var(--pokemon-gray-light)] bg-white text-[var(--pokemon-gray)] hover:border-[var(--pokemon-blue)] hover:bg-[rgb(0_114_206/0.06)] hover:text-[var(--pokemon-blue)]",
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!hydrated) {
          return;
        }

        dispatch(toggleFavorite(pokemon));

        if (pressed) {
          toast.info("Removed from favorites", displayName);
        } else {
          toast.success("Added to favorites", displayName);
        }
      }}
    >
      {pressed ? (
        <>
          <HiStar className="h-5 w-5 shrink-0" aria-hidden="true" />
          {isPill ? <span>Saved</span> : null}
        </>
      ) : (
        <>
          <HiOutlineStar className="h-5 w-5 shrink-0" aria-hidden="true" />
          {isPill ? <span>Add to favorites</span> : null}
        </>
      )}
    </button>
  );
}
