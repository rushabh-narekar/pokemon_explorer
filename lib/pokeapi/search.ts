export interface PokemonNameEntry {
  name: string;
}

export function filterPokemonNames<T extends PokemonNameEntry>(
  names: T[],
  query: string,
  limit = 20,
): T[] {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, "-");
  if (!normalized) {
    return [];
  }

  const startsWith: T[] = [];
  const includes: T[] = [];

  for (const entry of names) {
    if (entry.name.startsWith(normalized)) {
      startsWith.push(entry);
    } else if (entry.name.includes(normalized)) {
      includes.push(entry);
    }
  }

  startsWith.sort((a, b) => a.name.localeCompare(b.name));
  includes.sort((a, b) => a.name.localeCompare(b.name));

  return [...startsWith, ...includes].slice(0, limit);
}

export function isNumericPokemonSearch(query: string): boolean {
  return /^\d+$/.test(query.trim());
}
