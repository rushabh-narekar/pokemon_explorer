/** Narrow PokéAPI response shapes — only fields we map to domain models. */

export interface PokemonListApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      home?: { front_default: string | null };
      "official-artwork"?: { front_default: string | null };
    };
  };
  types: Array<{
    slot: number;
    type: { name: string; url: string };
  }>;
  abilities: Array<{
    is_hidden: boolean;
    ability: { name: string; url: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string; url: string };
  }>;
}

export interface PokemonSpeciesApiResponse {
  genera: Array<{ genus: string; language: { name: string } }>;
  habitat: { name: string; url: string } | null;
  evolution_chain: { url: string };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  capture_rate: number;
}

/** Domain models consumed by the UI */

export interface PokemonTypeInfo {
  name: string;
  slot: number;
}

export interface PokemonStat {
  name: string;
  label: string;
  baseStat: number;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonSummary {
  id: number;
  name: string;
  image: string | null;
  types: PokemonTypeInfo[];
}

export interface PokemonDetails extends PokemonSummary {
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}

export interface PokemonSpeciesInfo {
  genus: string | null;
  habitat: string | null;
  description: string | null;
  captureRate: number | null;
  evolutionChainUrl: string | null;
}

export interface PokemonListResult {
  count: number;
  results: PokemonSummary[];
}

export interface FavoritePokemon {
  id: number;
  name: string;
  image: string | null;
  types: PokemonTypeInfo[];
}
