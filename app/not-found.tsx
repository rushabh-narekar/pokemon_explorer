import Link from "next/link";

export default function NotFound() {
  return (
    <div className="panel-card mx-auto max-w-lg px-6 py-10 text-center">
      <h1 className="font-display text-2xl font-bold text-navy">Page not found</h1>
      <p className="mt-3 text-muted">The page you requested does not exist.</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/pokemon" className="btn-secondary">
          Browse catalog
        </Link>
      </div>
    </div>
  );
}
