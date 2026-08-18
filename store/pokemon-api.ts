import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PAGE_SIZE, POKEAPI_BASE_URL } from "@/lib/pokeapi/constants";
import { mapPokemonToSummary } from "@/lib/pokeapi/mappers";
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

/**
 * RTK Query slice for the catalog.
 * Tags: Catalog:{offset}-{limit}, Pokemon:{nameOrId}
 */
export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: POKEAPI_BASE_URL,
  }),
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 30,
  tagTypes: ["Catalog", "Pokemon"],
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
  }),
});

export const { useGetPokemonCatalogPageQuery, useGetPokemonByNameOrIdQuery } = pokemonApi;
