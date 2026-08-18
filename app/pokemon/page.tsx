import { Suspense } from "react";
import CatalogPage from "@/components/pokemon/CatalogPage";
import { CatalogSkeleton } from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Catalog",
};

export default function PokemonCatalogRoute() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogPage />
    </Suspense>
  );
}
