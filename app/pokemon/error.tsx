"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";

export default function PokemonCatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorMessage
      title="Catalog unavailable"
      message={error.message || "The catalog could not be loaded."}
      onRetry={reset}
    />
  );
}
