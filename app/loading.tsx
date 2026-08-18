import { SkeletonBlock } from "@/components/ui/LoadingSkeleton";

export default function RootLoading() {
  return (
    <div aria-busy="true" aria-live="polite" className="space-y-8">
      <SkeletonBlock className="h-40 w-full rounded-3xl" />
      <SkeletonBlock className="h-8 w-56" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-56" />
        ))}
      </div>
    </div>
  );
}
