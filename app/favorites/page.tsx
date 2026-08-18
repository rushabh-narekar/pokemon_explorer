import FavoritesList from "@/components/pokemon/FavoritesList";

export const metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="page-title">Your favorites</h1>
        <p className="page-lead">Pokémon you have saved for quick access.</p>
      </header>
      <FavoritesList />
    </div>
  );
}
