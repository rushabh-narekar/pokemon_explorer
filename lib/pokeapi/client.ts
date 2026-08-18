import { POKEAPI_BASE_URL, REVALIDATE_SECONDS } from "./constants";
import {
  mapPokemonToDetails,
  mapPokemonToSummary,
  mapSpeciesToInfo,
} from "./mappers";
import type {
  PokemonApiResponse,
  PokemonDetails,
  PokemonListApiResponse,
  PokemonListResult,
  PokemonSpeciesApiResponse,
  PokemonSpeciesInfo,
  PokemonSummary,
} from "./types";

export class PokeApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "PokeApiError";
    this.status = status;
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof PokeApiError && error.status === 404;
}

async function fetchFromPokeApi<T>(path: string): Promise<T> {
  const response = await fetch(`${POKEAPI_BASE_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new PokeApiError(`PokeAPI request failed (${response.status})`, response.status);
  }

  return response.json() as Promise<T>;
}

export async function getPokemon(nameOrId: string): Promise<PokemonDetails> {
  const data = await fetchFromPokeApi<PokemonApiResponse>(`/pokemon/${nameOrId}`);
  return mapPokemonToDetails(data);
}

export async function getPokemonSpecies(nameOrId: string): Promise<PokemonSpeciesInfo> {
  const data = await fetchFromPokeApi<PokemonSpeciesApiResponse>(
    `/pokemon-species/${nameOrId}`,
  );
  return mapSpeciesToInfo(data);
}

export async function getPokemonSummaries(names: string[]): Promise<PokemonSummary[]> {
  const results = await Promise.all(
    names.map(async (name) => {
      const data = await fetchFromPokeApi<PokemonApiResponse>(`/pokemon/${name}`);
      return mapPokemonToSummary(data);
    }),
  );
  return results;
}

export async function getPokemonList(
  limit: number,
  offset: number,
): Promise<PokemonListResult> {
  const list = await fetchFromPokeApi<PokemonListApiResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
  );

  const results = await Promise.all(
    list.results.map(async (item) => {
      const data = await fetchFromPokeApi<PokemonApiResponse>(`/pokemon/${item.name}`);
      return mapPokemonToSummary(data);
    }),
  );

  return {
    count: list.count,
    results,
  };
}
