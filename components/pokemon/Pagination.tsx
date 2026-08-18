"use client";

import Link from "next/link";
import { buildCatalogHref } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  search?: string;
  sort?: string;
}

export default function Pagination({
  page,
  pageSize,
  totalCount,
  search,
  sort = "name-asc",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Catalog pagination"
      className="panel-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-center text-sm font-semibold text-muted sm:text-left">
        Page {page} of {totalPages}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
        {hasPrevious ? (
          <Link
            href={buildCatalogHref({ page: page - 1, search, sort })}
            className="btn-secondary"
          >
            Previous
          </Link>
        ) : (
          <span className="btn-secondary cursor-not-allowed opacity-50" aria-disabled="true">
            Previous
          </span>
        )}
        {hasNext ? (
          <Link href={buildCatalogHref({ page: page + 1, search, sort })} className="btn-secondary">
            Next
          </Link>
        ) : (
          <span className="btn-secondary cursor-not-allowed opacity-50" aria-disabled="true">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
