import { Link } from "react-router-dom";
import { CarteFilm } from "../composants/CarteFilm";
import { useFavoris } from "../contextes/useFavoris";

export default function Favoris() {
  const { favoris, retirer } = useFavoris();

  if (favoris.length === 0) {
    return <p>Vous n'avez pas encore de favoris.</p>;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {favoris.map((film) => (
        <li key={film.imdbID} className="space-y-3">
          <Link to={`/films/${film.imdbID}`}>
            <CarteFilm film={film} />
          </Link>
          <button
            type="button"
            onClick={() => retirer(film.imdbID)}
            className="w-full rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            Retirer
          </button>
        </li>
      ))}
    </ul>
  );
}
