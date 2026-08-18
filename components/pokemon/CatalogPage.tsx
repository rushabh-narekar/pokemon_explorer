"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HiArrowPath, HiCheckCircle } from "react-icons/hi2";
import { PAGE_SIZE } from "@/lib/pokeapi/constants";
import { normalizePokemonQuery } from "@/lib/pokeapi/normalize";
import { sortPokemonSummaries } from "@/lib/utils";
import {
  useGetPokemonByNameOrIdQuery,
  useGetPokemonCatalogPageQuery,
} from "@/store/pokemon-api";
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

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const searchRaw = searchParams.get("search") ?? "";
  const sortParam = searchParams.get("sort");
  const sort: "name-asc" | "name-desc" = sortParam === "name-desc" ? "name-desc" : "name-asc";
  const normalizedSearch = searchRaw ? normalizePokemonQuery(searchRaw) : null;
  const offset = (page - 1) * PAGE_SIZE;
  const lastErrorKeyRef = useRef<string | null>(null);
  const lastNotFoundRef = useRef<string | null>(null);

  const catalogQuery = useGetPokemonCatalogPageQuery(
    { offset, limit: PAGE_SIZE },
    { skip: normalizedSearch !== null },
  );

  const lookupQuery = useGetPokemonByNameOrIdQuery(normalizedSearch ?? "", {
    skip: normalizedSearch === null,
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

  const isInitialLoading =
    (normalizedSearch === null && catalogQuery.isLoading && !catalogQuery.data) ||
    (normalizedSearch !== null && lookupQuery.isLoading && !lookupQuery.data);

  const isFetching =
    (normalizedSearch === null && catalogQuery.isFetching && !catalogQuery.isLoading) ||
    (normalizedSearch !== null && lookupQuery.isFetching && !lookupQuery.isLoading);

  const lookupNotFound =
    normalizedSearch !== null && lookupQuery.isError && isRtkNotFoundError(lookupQuery.error);

  const activeError =
    normalizedSearch === null
      ? catalogQuery.error
      : lookupQuery.error && !lookupNotFound
        ? lookupQuery.error
        : undefined;

  useEffect(() => {
    if (!activeError) {
      lastErrorKeyRef.current = null;
      return;
    }

    const errorKey = normalizedSearch !== null ? `search:${searchRaw}` : `page:${page}`;
    if (lastErrorKeyRef.current === errorKey) {
      return;
    }

    lastErrorKeyRef.current = errorKey;
    toast.error("Could not load Pokémon", "Check your connection and try again.");
  }, [activeError, normalizedSearch, page, searchRaw, toast]);

  useEffect(() => {
    if (!lookupNotFound || !searchRaw.trim()) {
      if (!lookupNotFound) {
        lastNotFoundRef.current = null;
      }
      return;
    }

    if (lastNotFoundRef.current === searchRaw) {
      return;
    }

    lastNotFoundRef.current = searchRaw;
    toast.warning("No Pokémon found", `No match for "${searchRaw.trim()}".`);
  }, [lookupNotFound, searchRaw, toast]);

  async function handleRetry() {
    if (normalizedSearch === null) {
      const result = await catalogQuery.refetch();
      if (result.error) {
        toast.error("Retry failed", "Please try again in a moment.");
        return;
      }
      toast.success("Catalog loaded", "Pokémon data is ready.");
      return;
    }

    const result = await lookupQuery.refetch();
    if (result.error) {
      if (isRtkNotFoundError(result.error)) {
        toast.warning("No Pokémon found", `No match for "${searchRaw.trim()}".`);
      } else {
        toast.error("Retry failed", "Please try again in a moment.");
      }
      return;
    }

    toast.success("Search complete", "Results updated.");
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="space-y-2 sm:space-y-3">
        <h1 className="page-title">Pokémon Catalog</h1>
        <p className="page-lead">Search, sort, and browse the full Pokédex.</p>
      </header>

      <section className="catalog-toolbar panel-card space-y-5" aria-label="Catalog controls">
        <div className="catalog-toolbar-grid">
          <PokemonSearch key={searchRaw} initialSearch={searchRaw} />
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
          Updating results…
        </p>
      ) : null}

      {isInitialLoading ? <CatalogSkeleton /> : null}

      {!isInitialLoading && activeError ? (
        <ErrorMessage
          message="We could not load Pokémon data right now. Check your connection and try again."
          onRetry={() => {
            void handleRetry();
          }}
        />
      ) : null}

      {!isInitialLoading && !activeError && normalizedSearch !== null && lookupQuery.data ? (
        <section aria-label="Search result" className="space-y-4">
          <div className="flex items-start gap-2 rounded-2xl border-2 border-[#78C850] bg-[#f0fff0] px-4 py-3 text-sm text-[var(--pokemon-navy)]">
            <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#4a9c2d]" aria-hidden="true" />
            <p>
              Found <strong>{searchRaw.trim()}</strong>
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:max-w-sm">
            <li>
              <PokemonCard pokemon={lookupQuery.data} catalogContext={catalogContext} prefetch />
            </li>
          </ul>
          <Link href={`/pokemon/${lookupQuery.data.name}`} className="btn-primary inline-flex">
            View details
          </Link>
        </section>
      ) : null}

      {!isInitialLoading &&
      !activeError &&
      normalizedSearch !== null &&
      (lookupNotFound || (!lookupQuery.data && !lookupQuery.isFetching)) ? (
        <EmptyState
          title="No Pokémon found"
          description={`We couldn't find a Pokémon matching "${searchRaw.trim()}". Try a name like pikachu or a number like 25.`}
          actionLabel="Browse catalog"
          actionHref="/pokemon"
        />
      ) : null}

      {!isInitialLoading && !activeError && normalizedSearch === null ? (
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
              description="Try another page or change your filters."
              actionLabel="Back to first page"
              actionHref="/pokemon"
            />
          )}
        </>
      ) : null}
    </div>
  );
}
