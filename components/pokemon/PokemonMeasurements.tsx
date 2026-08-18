interface PokemonMeasurementsProps {
  height: string;
  weight: string;
  habitat: string | null;
  captureRate: number | null;
}

export default function PokemonMeasurements({
  height,
  weight,
  habitat,
  captureRate,
}: PokemonMeasurementsProps) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border-2 border-[var(--pokemon-gray-light)] bg-[var(--pokemon-cream)] px-4 py-3">
        <dt className="text-sm font-semibold text-muted">Height</dt>
        <dd className="font-display text-lg font-bold text-navy">{height}</dd>
      </div>
      <div className="rounded-xl border-2 border-[var(--pokemon-gray-light)] bg-[var(--pokemon-cream)] px-4 py-3">
        <dt className="text-sm font-semibold text-muted">Weight</dt>
        <dd className="font-display text-lg font-bold text-navy">{weight}</dd>
      </div>
      {habitat ? (
        <div className="rounded-xl border-2 border-[var(--pokemon-gray-light)] bg-[var(--pokemon-cream)] px-4 py-3">
          <dt className="text-sm font-semibold text-muted">Habitat</dt>
          <dd className="font-display text-lg font-bold text-navy">{habitat}</dd>
        </div>
      ) : null}
      {captureRate !== null ? (
        <div className="rounded-xl border-2 border-[var(--pokemon-gray-light)] bg-[var(--pokemon-cream)] px-4 py-3">
          <dt className="text-sm font-semibold text-muted">Capture rate</dt>
          <dd className="font-display text-lg font-bold text-navy">{captureRate}</dd>
        </div>
      ) : null}
    </dl>
  );
}
