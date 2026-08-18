"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";

export default function PokemonDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorMessage
      title="Could not load Pokémon"
      message={error.message || "Something prevented this Pokémon from loading."}
      onRetry={reset}
    />
  );
}
