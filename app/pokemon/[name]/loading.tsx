import { DetailSkeleton } from "@/components/ui/LoadingSkeleton";

export default function PokemonDetailLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-8">
      <div className="h-11 w-48 animate-pulse rounded-full bg-[var(--pokemon-gray-light)] motion-reduce:animate-none" />
      <DetailSkeleton />
    </div>
  );
}
