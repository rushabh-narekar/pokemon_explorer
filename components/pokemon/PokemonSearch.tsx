"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { HiHashtag, HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { normalizePokemonQuery } from "@/lib/pokeapi/normalize";
import { buildCatalogHref } from "@/lib/utils";
import { useToast } from "@/components/ui/toast/useToast";

interface PokemonSearchProps {
  initialSearch?: string;
}

const searchExamples = [
  { label: "Pikachu", value: "pikachu", icon: null },
  { label: "25", value: "25", icon: "hash" as const },
  { label: "Charizard", value: "charizard", icon: null },
] as const;

export default function PokemonSearch({ initialSearch = "" }: PokemonSearchProps) {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearch);
  const sort = searchParams.get("sort") ?? "name-asc";

  function navigateToCatalog(search?: string) {
    router.push(
      buildCatalogHref({
        page: 1,
        search,
        sort,
      }),
    );
  }

  function submitSearch(raw: string) {
    const trimmed = raw.trim();
    const normalized = normalizePokemonQuery(raw);

    if (normalized === null && trimmed) {
      toast.warning("Invalid search", "Enter a valid Pokémon name or Pokédex number.");
      return;
    }

    if (normalized === null) {
      navigateToCatalog();
      return;
    }

    navigateToCatalog(String(normalized));
  }

  function clearSearch() {
    setValue("");
    navigateToCatalog();
    toast.info("Search cleared", "Showing the full catalog again.");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSearch(value);
  }

  return (
    <div className="space-y-4">
      <div className="field-heading">
        <p id="pokemon-search-label" className="font-display text-base font-bold text-navy">
          Search
        </p>
        <p id="pokemon-search-help" className="mt-1 text-sm text-muted">
          Name or Pokédex number — press Enter or tap Search.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="search-actions">
          <div className="search-field-wrap">
            <HiMagnifyingGlass className="search-field-icon" aria-hidden="true" />
            <input
              id="pokemon-search"
              name="search"
              type="search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="e.g. pikachu or 25"
              className="search-input-with-icon"
              autoComplete="off"
              enterKeyHint="search"
              aria-labelledby="pokemon-search-label"
              aria-describedby="pokemon-search-help"
            />
            {value ? (
              <button
                type="button"
                onClick={clearSearch}
                className="search-clear-inside"
                aria-label="Clear search"
              >
                <HiXMark className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2 sm:min-w-[7.5rem]">
            <HiMagnifyingGlass className="h-4 w-4" aria-hidden="true" />
            Search
          </button>
        </div>
      </form>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Quick picks</p>
        <div className="flex flex-wrap gap-2" aria-label="Search examples">
          {searchExamples.map((example) => (
            <button
              key={example.value}
              type="button"
              className="example-chip"
              onClick={() => {
                setValue(example.value);
                submitSearch(example.value);
              }}
            >
              {example.icon === "hash" ? (
                <HiHashtag className="h-3.5 w-3.5 text-[var(--pokemon-blue)]" aria-hidden="true" />
              ) : null}
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
