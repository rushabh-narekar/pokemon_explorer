import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PAGE_SIZE, POKEAPI_BASE_URL } from "@/lib/pokeapi/constants";
import { mapPokemonToSummary } from "@/lib/pokeapi/mappers";
import { filterPokemonNames } from "@/lib/pokeapi/search";
import type {
  PokemonApiResponse,
  PokemonListApiResponse,
  PokemonListResult,
  PokemonSummary,
} from "@/lib/pokeapi/types";

export interface CatalogPageArgs {
  offset: number;
  limit?: number;
}

const NAME_INDEX_LIMIT = 2000;
const SEARCH_RESULT_LIMIT = 20;

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: POKEAPI_BASE_URL,
  }),
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 30,
  tagTypes: ["Catalog", "Pokemon", "NameIndex"],
  endpoints: (builder) => ({
    getPokemonCatalogPage: builder.query<PokemonListResult, CatalogPageArgs>({
      async queryFn({ offset, limit = PAGE_SIZE }, _api, _extraOptions, fetchWithBQ) {
        const listResult = await fetchWithBQ(`/pokemon?limit=${limit}&offset=${offset}`);

        if (listResult.error) {
          return { error: listResult.error };
        }

        const listData = listResult.data as PokemonListApiResponse;
        const detailResults = await Promise.all(
          listData.results.map((item) => fetchWithBQ(`/pokemon/${item.name}`)),
        );

        const summaries: PokemonSummary[] = [];
        for (const detail of detailResults) {
          if (detail.data) {
            summaries.push(mapPokemonToSummary(detail.data as PokemonApiResponse));
          }
        }

        return {
          data: {
            count: listData.count,
            results: summaries,
          },
        };
      },
      providesTags: (_result, _error, arg) => [
        { type: "Catalog", id: `${arg.offset}-${arg.limit ?? PAGE_SIZE}` },
      ],
    }),
    getPokemonByNameOrId: builder.query<PokemonSummary, string | number>({
      query: (nameOrId) => `/pokemon/${nameOrId}`,
      transformResponse: (response: PokemonApiResponse) => mapPokemonToSummary(response),
      providesTags: (_result, _error, arg) => [{ type: "Pokemon", id: String(arg) }],
    }),
    getPokemonNameIndex: builder.query<PokemonListApiResponse["results"], void>({
      query: () => `/pokemon?limit=${NAME_INDEX_LIMIT}`,
      transformResponse: (response: PokemonListApiResponse) => response.results,
      keepUnusedDataFor: 3600,
      providesTags: [{ type: "NameIndex", id: "ALL" }],
    }),
    searchPokemonSummaries: builder.query<PokemonListResult, string>({
      async queryFn(query, _api, _extraOptions, fetchWithBQ) {
        const trimmed = query.trim();
        if (!trimmed) {
          return { data: { count: 0, results: [] } };
        }

        const indexResult = await fetchWithBQ(`/pokemon?limit=${NAME_INDEX_LIMIT}`);

        if (indexResult.error) {
          return { error: indexResult.error };
        }

        const nameIndex = (indexResult.data as PokemonListApiResponse).results;
        const matches = filterPokemonNames(nameIndex, trimmed, SEARCH_RESULT_LIMIT);
        if (matches.length === 0) {
          return { data: { count: 0, results: [] } };
        }

        const detailResults = await Promise.all(
          matches.map((item) => fetchWithBQ(`/pokemon/${item.name}`)),
        );

        const summaries: PokemonSummary[] = [];
        for (const detail of detailResults) {
          if (detail.data) {
            summaries.push(mapPokemonToSummary(detail.data as PokemonApiResponse));
          }
        }

        return {
          data: {
            count: summaries.length,
            results: summaries,
          },
        };
      },
      providesTags: (_result, _error, query) => [{ type: "Pokemon", id: `search:${query}` }],
    }),
  }),
});

export const {
  useGetPokemonCatalogPageQuery,
  useGetPokemonByNameOrIdQuery,
  useGetPokemonNameIndexQuery,
  useSearchPokemonSummariesQuery,
} = pokemonApi;
