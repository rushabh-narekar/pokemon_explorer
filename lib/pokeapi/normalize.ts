const MAX_POKEMON_ID = 10_277;

export function normalizePokemonQuery(input: string): string | number | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    const id = Number.parseInt(trimmed, 10);
    if (Number.isNaN(id) || id < 1 || id > MAX_POKEMON_ID) {
      return null;
    }
    return id;
  }

  return trimmed.toLowerCase().replace(/\s+/g, "-");
}

export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatHeight(decimeters: number): string {
  const meters = decimeters / 10;
  return `${meters.toFixed(1)} m`;
}

export function formatWeight(hectograms: number): string {
  const kilograms = hectograms / 10;
  return `${kilograms.toFixed(1)} kg`;
}
