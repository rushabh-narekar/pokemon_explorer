"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiHashtag, HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import { formatPokemonName, normalizePokemonQuery } from "@/lib/pokeapi/normalize";
import { filterPokemonNames } from "@/lib/pokeapi/search";
import { buildCatalogHref } from "@/lib/utils";
import { useGetPokemonNameIndexQuery } from "@/store/pokemon-api";
import { useToast } from "@/components/ui/toast/useToast";

interface PokemonSearchProps {
  initialSearch?: string;
}

const searchExamples = [
  { label: "Pikachu", value: "pikachu", icon: null },
  { label: "25", value: "25", icon: "hash" as const },
  { label: "Char", value: "char", icon: null },
] as const;

const LIVE_SEARCH_MIN_CHARS = 2;
const LIVE_SEARCH_DELAY_MS = 350;
const SUGGESTION_LIMIT = 8;

export default function PokemonSearch({ initialSearch = "" }: PokemonSearchProps) {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialSearch);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const skipLiveSearchRef = useRef(true);
  const sort = searchParams.get("sort") ?? "name-asc";
  const { data: nameIndex } = useGetPokemonNameIndexQuery();

  const navigateToCatalog = useCallback(
    (search?: string) => {
      router.push(
        buildCatalogHref({
          page: 1,
          search,
          sort,
        }),
      );
    },
    [router, sort],
  );

  const suggestions = useMemo(() => {
    if (!nameIndex || value.trim().length < 1) {
      return [];
    }
    return filterPokemonNames(nameIndex, value.trim(), SUGGESTION_LIMIT);
  }, [nameIndex, value]);

  function submitSearch(raw: string) {
    const trimmed = raw.trim();
    const normalized = normalizePokemonQuery(raw);

    if (normalized === null && trimmed) {
      toast.warning("Invalid search", "Use a Pokémon name or Pokédex number.");
      return;
    }

    setShowSuggestions(false);

    if (normalized === null) {
      navigateToCatalog();
      return;
    }

    navigateToCatalog(trimmed);
  }

  function clearSearch() {
    setValue("");
    setShowSuggestions(false);
    navigateToCatalog();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitSearch(value);
  }

  function pickSuggestion(name: string) {
    setValue(name);
    setShowSuggestions(false);
    navigateToCatalog(name);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync from URL on back/forward
    setValue(initialSearch);
    skipLiveSearchRef.current = true;
  }, [initialSearch]);

  useEffect(() => {
    if (skipLiveSearchRef.current) {
      skipLiveSearchRef.current = false;
      return;
    }

    const trimmed = value.trim();

    if (trimmed === initialSearch) {
      return;
    }

    if (trimmed.length === 0) {
      const timer = window.setTimeout(() => navigateToCatalog(), LIVE_SEARCH_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    if (trimmed.length < LIVE_SEARCH_MIN_CHARS) {
      return;
    }

    const timer = window.setTimeout(() => navigateToCatalog(trimmed), LIVE_SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [value, initialSearch, navigateToCatalog]);

  const listboxId = "pokemon-search-suggestions";

  return (
    <div className="space-y-4">
      <div className="field-heading">
        <p id="pokemon-search-label" className="font-display text-base font-bold text-navy">
          Search
        </p>
        <p id="pokemon-search-help" className="mt-1 text-sm text-muted">
          Start typing — results update as you go. Numbers work too (e.g. 25).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="search-actions">
          <div className="search-field-wrap">
            <HiMagnifyingGlass className="search-field-icon" aria-hidden="true" />
            <input
              id="pokemon-search"
              name="search"
              type="text"
              inputMode="search"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                window.setTimeout(() => setShowSuggestions(false), 150);
              }}
              placeholder="pi, char, pikachu, 25…"
              className="search-input-with-icon"
              autoComplete="off"
              enterKeyHint="search"
              role="combobox"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls={listboxId}
              aria-autocomplete="list"
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

            {showSuggestions && suggestions.length > 0 ? (
              <ul id={listboxId} className="search-suggestions" role="listbox" aria-label="Suggestions">
                {suggestions.map((entry) => (
                  <li key={entry.name}>
                    <button
                      type="button"
                      className="search-suggestion-item"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => pickSuggestion(entry.name)}
                    >
                      {formatPokemonName(entry.name)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2 sm:min-w-[7.5rem]">
            <HiMagnifyingGlass className="h-4 w-4" aria-hidden="true" />
            Search
          </button>
        </div>
      </form>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Try these</p>
        <div className="flex flex-wrap gap-2" aria-label="Example searches">
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
