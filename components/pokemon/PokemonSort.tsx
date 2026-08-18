"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";
import { buildCatalogHref, cn } from "@/lib/utils";

const sortOptions = [
  { value: "name-asc", label: "A → Z", fullLabel: "Name A–Z", Icon: HiArrowDown },
  { value: "name-desc", label: "Z → A", fullLabel: "Name Z–A", Icon: HiArrowUp },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

function parseSort(value: string | null): SortValue {
  return value === "name-desc" ? "name-desc" : "name-asc";
}

export default function PokemonSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = parseSort(searchParams.get("sort"));
  const search = searchParams.get("search") ?? undefined;

  return (
    <div className="space-y-4">
      <div className="field-heading">
        <p id="pokemon-sort-label" className="font-display text-base font-bold text-navy">
          Sort
        </p>
        <p className="mt-1 text-sm text-muted">Current page only — no extra loading.</p>
      </div>
      <div role="group" aria-labelledby="pokemon-sort-label" className="sort-segment">
        {sortOptions.map((option) => {
          const active = currentSort === option.value;
          const Icon = option.Icon;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              aria-label={option.fullLabel}
              title={option.fullLabel}
              onClick={() => {
                router.push(
                  buildCatalogHref({
                    page: 1,
                    search,
                    sort: option.value,
                  }),
                );
              }}
              className={cn("sort-segment-btn", active && "sort-segment-btn-active")}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
