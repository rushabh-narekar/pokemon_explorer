"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPokemonName } from "@/lib/pokeapi/normalize";
import { cn } from "@/lib/utils";

interface PokemonArtworkProps {
  name: string;
  image: string | null;
  priority?: boolean;
  className?: string;
  sizes?: string;
  aspect?: "square" | "wide";
}

export default function PokemonArtwork({
  name,
  image,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, 320px",
  aspect = "square",
}: PokemonArtworkProps) {
  const [broken, setBroken] = useState(false);
  const displayName = formatPokemonName(name);

  if (!image || broken) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl bg-[var(--pokemon-cream)] text-center",
          aspect === "wide" ? "aspect-[4/3]" : "aspect-square",
          className,
        )}
        role="img"
        aria-label={`${displayName} artwork unavailable`}
      >
        <div>
          <p className="font-display text-4xl font-bold text-[var(--pokemon-blue)]">?</p>
          <p className="mt-2 text-sm font-semibold text-muted">{displayName}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[var(--pokemon-cream)]",
        aspect === "wide" ? "aspect-[4/3]" : "aspect-square",
        className,
      )}
    >
      <Image
        src={image}
        alt={`Official artwork of ${displayName}`}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain p-4"
        onError={() => setBroken(true)}
      />
    </div>
  );
}
