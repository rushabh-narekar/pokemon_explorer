"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { HiArrowPath, HiCheckCircle } from "react-icons/hi2";
import { PAGE_SIZE } from "@/lib/pokeapi/constants";
import { normalizePokemonQuery } from "@/lib/pokeapi/normalize";
import { isNumericPokemonSearch } from "@/lib/pokeapi/search";
import { sortPokemonSummaries } from "@/lib/utils";
import {
  useGetPokemonByNameOrIdQuery,
  useGetPokemonCatalogPageQuery,
  useSearchPokemonSummariesQuery,
} from "@/store/pokemon-api";
import type { PokemonSummary } from "@/lib/pokeapi/types";
import { isRtkNotFoundError } from "@/lib/rtk-errors";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { CatalogSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/toast/useToast";
import CatalogActiveFilters from "./CatalogActiveFilters";
import Pagination from "./Pagination";
import PokemonCard from "./PokemonCard";
import PokemonGrid from "./PokemonGrid";
import PokemonSearch from "./PokemonSearch";
import PokemonSort from "./PokemonSort";

const LIVE_SEARCH_MIN_CHARS = 2;

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const searchRaw = searchParams.get("search") ?? "";
  const sortParam = searchParams.get("sort");
  const sort: "name-asc" | "name-desc" = sortParam === "name-desc" ? "name-desc" : "name-asc";
  const trimmedSearch = searchRaw.trim();
  const isNumericSearch = trimmedSearch ? isNumericPokemonSearch(trimmedSearch) : false;
  const isTextSearch = trimmedSearch.length >= LIVE_SEARCH_MIN_CHARS && !isNumericSearch;
  const normalizedSearch = trimmedSearch ? normalizePokemonQuery(trimmedSearch) : null;
  const offset = (page - 1) * PAGE_SIZE;
  const lastErrorKeyRef = useRef<string | null>(null);
  const lastNotFoundRef = useRef<string | null>(null);

  const catalogQuery = useGetPokemonCatalogPageQuery(
    { offset, limit: PAGE_SIZE },
    { skip: trimmedSearch !== "" },
  );

  const lookupQuery = useGetPokemonByNameOrIdQuery(normalizedSearch ?? "", {
    skip: !isNumericSearch || normalizedSearch === null,
  });

  const textSearchQuery = useSearchPokemonSummariesQuery(trimmedSearch, {
    skip: !isTextSearch,
  });

  const catalogContext = useMemo(
    () => ({
      page,
      search: searchRaw || undefined,
      sort,
    }),
    [page, searchRaw, sort],
  );

  const sortedResults = useMemo(() => {
    if (!catalogQuery.data) {
      return [];
    }
    return sortPokemonSummaries(catalogQuery.data.results, sort);
  }, [catalogQuery.data, sort]);

  const sortedSearchResults = useMemo((): PokemonSummary[] => {
    if (!textSearchQuery.data) {
      return [];
    }
    return sortPokemonSummaries(textSearchQuery.data.results, sort);
  }, [textSearchQuery.data, sort]);

  const activeSearchQuery = isNumericSearch ? lookupQuery : textSearchQuery;

  const isInitialLoading =
    (trimmedSearch === "" && catalogQuery.isLoading && !catalogQuery.data) ||
    (isNumericSearch && lookupQuery.isLoading && !lookupQuery.data) ||
    (isTextSearch && textSearchQuery.isLoading && !textSearchQuery.data);

  const isFetching =
    (trimmedSearch === "" && catalogQuery.isFetching && !catalogQuery.isLoading) ||
    (trimmedSearch !== "" && activeSearchQuery.isFetching && !activeSearchQuery.isLoading);

  const lookupNotFound =
    isNumericSearch &&
    trimmedSearch !== "" &&
    lookupQuery.isError &&
    isRtkNotFoundError(lookupQuery.error);

  const textSearchEmpty =
    isTextSearch &&
    !textSearchQuery.isLoading &&
    !textSearchQuery.isFetching &&
    sortedSearchResults.length === 0 &&
    !textSearchQuery.error;

  const activeError =
    trimmedSearch === ""
      ? catalogQuery.error
      : isNumericSearch
        ? lookupQuery.error && !lookupNotFound
          ? lookupQuery.error
          : undefined
        : textSearchQuery.error;

  useEffect(() => {
    if (!activeError) {
      lastErrorKeyRef.current = null;
      return;
    }

    const errorKey = trimmedSearch !== "" ? `search:${searchRaw}` : `page:${page}`;
    if (lastErrorKeyRef.current === errorKey) {
      return;
    }

    lastErrorKeyRef.current = errorKey;
    toast.error("Could not load Pokémon", "Check your connection and try again.");
  }, [activeError, trimmedSearch, page, searchRaw, toast]);

  useEffect(() => {
    if (!lookupNotFound || !trimmedSearch) {
      if (!lookupNotFound) {
        lastNotFoundRef.current = null;
      }
      return;
    }

    if (lastNotFoundRef.current === searchRaw) {
      return;
    }

    lastNotFoundRef.current = searchRaw;
    toast.warning("No Pokémon found", `No match for "${trimmedSearch}".`);
  }, [lookupNotFound, searchRaw, trimmedSearch, toast]);

  async function handleRetry() {
    if (trimmedSearch === "") {
      await catalogQuery.refetch();
      return;
    }
    await activeSearchQuery.refetch();
  }

  const numericResult = lookupQuery.data;
  const showNumericResult = !isInitialLoading && !activeError && isNumericSearch && numericResult;
  const showTextSearchResults =
    !isInitialLoading && !activeError && isTextSearch && sortedSearchResults.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-2 sm:space-y-3">
        <h1 className="page-title">Pokémon Catalog</h1>
        <p className="page-lead">Type to search — results show up as you go.</p>
      </header>

      <section className="catalog-toolbar panel-card space-y-5" aria-label="Catalog controls">
        <div className="catalog-toolbar-grid">
          <PokemonSearch initialSearch={searchRaw} />
          <div className="catalog-toolbar-divider" aria-hidden="true" />
          <PokemonSort />
        </div>
        <Suspense fallback={null}>
          <CatalogActiveFilters />
        </Suspense>
      </section>

      {isFetching ? (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border-2 border-[var(--pokemon-yellow-dark)] bg-[#fffbe6] px-4 py-2 text-sm font-bold text-[var(--pokemon-navy)]"
        >
          <HiArrowPath className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Updating…
        </p>
      ) : null}

      {isInitialLoading ? <CatalogSkeleton /> : null}

      {!isInitialLoading && activeError ? (
        <ErrorMessage
          message="Couldn't load Pokémon data. Check your connection."
          onRetry={() => {
            void handleRetry();
          }}
        />
      ) : null}

      {showNumericResult ? (
        <section aria-label="Search result" className="space-y-4">
          <div className="flex items-start gap-2 rounded-2xl border-2 border-[#78C850] bg-[#f0fff0] px-4 py-3 text-sm text-[var(--pokemon-navy)]">
            <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#4a9c2d]" aria-hidden="true" />
            <p>
              Found <strong>{trimmedSearch}</strong>
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:max-w-sm">
            <li>
              <PokemonCard pokemon={numericResult} catalogContext={catalogContext} prefetch />
            </li>
          </ul>
        </section>
      ) : null}

      {showTextSearchResults ? (
        <section aria-label="Search results" className="space-y-4">
          <div className="flex items-start gap-2 rounded-2xl border-2 border-[#78C850] bg-[#f0fff0] px-4 py-3 text-sm text-[var(--pokemon-navy)]">
            <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#4a9c2d]" aria-hidden="true" />
            <p>
              {sortedSearchResults.length === 1 ? (
                <>
                  Found <strong>{trimmedSearch}</strong>
                </>
              ) : (
                <>
                  {sortedSearchResults.length} matches for <strong>{trimmedSearch}</strong>
                </>
              )}
            </p>
          </div>
          <PokemonGrid pokemon={sortedSearchResults} catalogContext={catalogContext} />
        </section>
      ) : null}

      {!isInitialLoading &&
      !activeError &&
      trimmedSearch !== "" &&
      (lookupNotFound || textSearchEmpty) ? (
        <EmptyState
          title="No Pokémon found"
          description={`Nothing matched "${trimmedSearch}". Try part of a name like "char" or a number like 25.`}
          actionLabel="Browse catalog"
          actionHref="/pokemon"
        />
      ) : null}

      {!isInitialLoading && !activeError && trimmedSearch === "" ? (
        <>
          {sortedResults.length > 0 ? (
            <>
              <PokemonGrid pokemon={sortedResults} catalogContext={catalogContext} />
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={catalogQuery.data?.count ?? 0}
                search={searchRaw || undefined}
                sort={sort}
              />
            </>
          ) : (
            <EmptyState
              title="No Pokémon on this page"
              description="Try another page."
              actionLabel="Back to first page"
              actionHref="/pokemon"
            />
          )}
        </>
      ) : null}
    </div>
  );
}
