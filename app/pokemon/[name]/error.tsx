"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";

export default function PokemonDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorMessage
      title="Could not load Pokémon"
      message="We couldn't load this Pokémon right now. Please try again."
      onRetry={reset}
    />
  );
}
