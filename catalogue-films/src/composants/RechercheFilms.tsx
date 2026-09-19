import { useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { urlRecherche, type ReponseRecherche } from "../lib/omdb";
import { CarteFilm } from "./CarteFilm";

export default function RechercheFilms() {
  const [terme, setTerme] = useState("");
  const url = terme.trim() === "" ? null : urlRecherche(terme.trim());
  const { donnees, chargement, erreur } = useFetch<ReponseRecherche>(url);
  const films = donnees?.Search ?? [];

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Rechercher un film</h2>
      <input
        type="search"
        value={terme}
        onChange={(e) => setTerme(e.target.value)}
        placeholder="Exemple : Batman"
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-300"
      />

      {!terme.trim() ? (
        <p className="text-slate-600">Tapez un titre pour lancer la recherche.</p>
      ) : chargement ? (
        <p className="text-slate-600">Chargement...</p>
      ) : erreur ? (
        <p className="text-red-600">{erreur}</p>
      ) : donnees?.Response === "False" ? (
        <p className="text-red-600">{donnees.Error ?? "La recherche a échoué."}</p>
      ) : films.length === 0 ? (
        <p className="text-slate-600">
          Aucun film ne correspond à « {terme.trim()} ».
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {films.map((film) => (
            <li key={film.imdbID}>
              <Link to={`/films/${film.imdbID}`}>
                <CarteFilm film={film} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
