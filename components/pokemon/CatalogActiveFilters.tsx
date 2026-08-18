"use client";

import Link from "next/link";
import { HiXMark } from "react-icons/hi2";
import { useSearchParams } from "next/navigation";
import { buildCatalogHref } from "@/lib/utils";

export default function CatalogActiveFilters() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  const hasFilters = Boolean(search) || sort === "name-desc" || page > 1;

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="catalog-filters-row" aria-label="Active catalog filters">
      <span className="text-xs font-bold uppercase tracking-wide text-muted">Showing</span>
      {search ? (
        <span className="filter-chip">
          “{search}”
          <Link
            href={buildCatalogHref({ page: 1, sort: sort ?? "name-asc" })}
            className="focus-pokemon inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/60"
            aria-label="Remove search filter"
          >
            <HiXMark className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </span>
      ) : null}
      {sort === "name-desc" ? <span className="filter-chip">Sorted Z → A</span> : null}
      {page > 1 ? <span className="filter-chip">Page {page}</span> : null}
    </div>
  );
}
