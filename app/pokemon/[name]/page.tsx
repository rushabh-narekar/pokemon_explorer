import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPokemon, getPokemonSpecies, isNotFoundError } from "@/lib/pokeapi/client";
import { formatPokemonName, normalizePokemonQuery } from "@/lib/pokeapi/normalize";
import { buildBackToCatalogHref } from "@/lib/utils";
import PokemonDetailView from "@/components/pokemon/PokemonDetailView";

interface PageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{
    fromPage?: string;
    fromSearch?: string;
    fromSort?: string;
  }>;
}

async function loadPokemonDetail(nameOrId: string) {
  try {
    const [pokemon, species] = await Promise.all([
      getPokemon(nameOrId),
      getPokemonSpecies(nameOrId),
    ]);
    return { pokemon, species };
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const normalized = normalizePokemonQuery(name);

  if (normalized === null) {
    return { title: "Pokémon Not Found" };
  }

  try {
    const pokemon = await getPokemon(String(normalized));
    return {
      title: formatPokemonName(pokemon.name),
      description: `View stats, abilities, and species information for ${formatPokemonName(pokemon.name)}.`,
    };
  } catch {
    return { title: "Pokémon Not Found" };
  }
}

export default async function PokemonDetailPage({ params, searchParams }: PageProps) {
  const [{ name }, query] = await Promise.all([params, searchParams]);
  const normalized = normalizePokemonQuery(name);

  if (normalized === null) {
    notFound();
  }

  const { pokemon, species } = await loadPokemonDetail(String(normalized));
  const backHref = buildBackToCatalogHref(query);

  return (
    <div className="space-y-8">
      <nav aria-label="Detail navigation">
        <Link href={backHref} className="btn-secondary inline-flex">
          Back to catalog results
        </Link>
      </nav>
      <PokemonDetailView pokemon={pokemon} species={species} />
    </div>
  );
}
