import { STAT_LABELS } from "./constants";
import { formatPokemonName } from "./normalize";
import type {
  PokemonAbility,
  PokemonApiResponse,
  PokemonDetails,
  PokemonSpeciesApiResponse,
  PokemonSpeciesInfo,
  PokemonStat,
  PokemonSummary,
  PokemonTypeInfo,
} from "./types";

export function getPokemonImageUrl(pokemon: PokemonApiResponse): string | null {
  return (
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.other?.home?.front_default ??
    pokemon.sprites.front_default ??
    null
  );
}

export function mapTypes(apiTypes: PokemonApiResponse["types"]): PokemonTypeInfo[] {
  return apiTypes.map(({ slot, type }) => ({
    slot,
    name: type.name,
  }));
}

export function mapStats(apiStats: PokemonApiResponse["stats"]): PokemonStat[] {
  return apiStats.map(({ base_stat, stat }) => ({
    name: stat.name,
    label: STAT_LABELS[stat.name] ?? formatPokemonName(stat.name),
    baseStat: base_stat,
  }));
}

export function mapAbilities(
  apiAbilities: PokemonApiResponse["abilities"],
): PokemonAbility[] {
  return apiAbilities.map(({ ability, is_hidden }) => ({
    name: formatPokemonName(ability.name),
    isHidden: is_hidden,
  }));
}

export function mapPokemonToSummary(data: PokemonApiResponse): PokemonSummary {
  return {
    id: data.id,
    name: data.name,
    image: getPokemonImageUrl(data),
    types: mapTypes(data.types),
  };
}

export function mapPokemonToDetails(data: PokemonApiResponse): PokemonDetails {
  return {
    ...mapPokemonToSummary(data),
    height: data.height,
    weight: data.weight,
    abilities: mapAbilities(data.abilities),
    stats: mapStats(data.stats),
  };
}

export function mapSpeciesToInfo(data: PokemonSpeciesApiResponse): PokemonSpeciesInfo {
  const englishGenus = data.genera.find((entry) => entry.language.name === "en");
  const englishDescription = data.flavor_text_entries
    .filter((entry) => entry.language.name === "en")
    .map((entry) => entry.flavor_text.replace(/\f|\n|\r/g, " ").replace(/\s+/g, " ").trim())
    .pop();

  return {
    genus: englishGenus?.genus ?? null,
    habitat: data.habitat?.name ? formatPokemonName(data.habitat.name) : null,
    description: englishDescription ?? null,
    captureRate: data.capture_rate ?? null,
  };
}
