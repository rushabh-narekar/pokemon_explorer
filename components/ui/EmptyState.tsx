import Link from "next/link";
import { HiOutlineInbox } from "react-icons/hi2";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="panel-card border-dashed px-5 py-10 text-center sm:px-6 sm:py-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--pokemon-yellow)] text-[var(--pokemon-navy)]">
        <HiOutlineInbox className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="font-display mt-4 text-xl font-bold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted sm:text-base">{description}</p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn-primary mt-6 inline-flex">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
