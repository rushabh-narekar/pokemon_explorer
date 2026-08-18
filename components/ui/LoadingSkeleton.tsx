import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function SkeletonBlock({ className }: LoadingSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-xl bg-[var(--pokemon-gray-light)] motion-reduce:animate-none", className)}
    />
  );
}

export function CatalogSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SkeletonBlock className="h-10 w-full max-w-md" />
        <SkeletonBlock className="h-10 w-40" />
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-56" />
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <SkeletonBlock className="aspect-square w-full max-w-md" />
      <div className="space-y-4">
        <SkeletonBlock className="h-10 w-2/3" />
        <SkeletonBlock className="h-6 w-1/3" />
        <SkeletonBlock className="h-32 w-full" />
        <SkeletonBlock className="h-48 w-full" />
      </div>
    </div>
  );
}
