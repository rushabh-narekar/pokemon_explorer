"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";

export default function PokemonCatalogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorMessage
      title="Catalog unavailable"
      message="We couldn't load the catalog right now. Please try again."
      onRetry={reset}
    />
  );
}
