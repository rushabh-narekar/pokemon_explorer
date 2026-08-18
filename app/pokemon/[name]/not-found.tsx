import Link from "next/link";

export default function PokemonNotFound() {
  return (
    <div className="panel-card mx-auto max-w-lg px-6 py-10 text-center">
      <h1 className="font-display text-2xl font-bold text-navy">Pokémon not found</h1>
      <p className="mt-3 text-muted">
        We couldn&apos;t find a Pokémon matching that name or ID. Try an exact name like{" "}
        <strong>pikachu</strong> or a valid numeric ID.
      </p>
      <Link href="/pokemon" className="btn-primary mt-6 inline-flex">
        Back to catalog
      </Link>
    </div>
  );
}
