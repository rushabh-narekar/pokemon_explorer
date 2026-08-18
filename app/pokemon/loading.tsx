import { CatalogSkeleton } from "@/components/ui/LoadingSkeleton";

export default function PokemonCatalogLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[var(--pokemon-gray-light)] motion-reduce:animate-none" />
        <div className="h-5 w-full max-w-2xl animate-pulse rounded-lg bg-[var(--pokemon-gray-light)] motion-reduce:animate-none" />
      </div>
      <CatalogSkeleton />
    </div>
  );
}
