export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function sortPokemonSummaries<T extends { name: string }>(
  items: T[],
  sort: "name-asc" | "name-desc",
): T[] {
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
  return sort === "name-desc" ? sorted.reverse() : sorted;
}

export function buildCatalogHref(params: {
  page?: number;
  search?: string;
  sort?: string;
}): string {
  const query = new URLSearchParams();
  if (params.page && params.page > 1) {
    query.set("page", String(params.page));
  }
  if (params.search) {
    query.set("search", params.search);
  }
  if (params.sort && params.sort !== "name-asc") {
    query.set("sort", params.sort);
  }
  const qs = query.toString();
  return qs ? `/pokemon?${qs}` : "/pokemon";
}

export function buildDetailHref(
  name: string,
  catalogContext?: { page?: number; search?: string; sort?: string },
): string {
  if (!catalogContext) {
    return `/pokemon/${name}`;
  }

  const query = new URLSearchParams();
  if (catalogContext.page && catalogContext.page > 1) {
    query.set("fromPage", String(catalogContext.page));
  }
  if (catalogContext.search) {
    query.set("fromSearch", catalogContext.search);
  }
  if (catalogContext.sort && catalogContext.sort !== "name-asc") {
    query.set("fromSort", catalogContext.sort);
  }

  const qs = query.toString();
  return qs ? `/pokemon/${name}?${qs}` : `/pokemon/${name}`;
}

export function buildBackToCatalogHref(searchParams: {
  fromPage?: string;
  fromSearch?: string;
  fromSort?: string;
}): string {
  const page = searchParams.fromPage ? Number.parseInt(searchParams.fromPage, 10) : 1;
  return buildCatalogHref({
    page: Number.isNaN(page) ? 1 : page,
    search: searchParams.fromSearch,
    sort: searchParams.fromSort ?? "name-asc",
  });
}
