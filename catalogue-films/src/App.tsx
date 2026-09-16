import { useState } from "react";
import { useDebounce, useFetch } from "./hooks/useFetch";
import { construireUrlRecherche, type FilmOmdb, type ReponseRecherche } from "./lib/omdb";

function App() {
  const [terme, setTerme] = useState("");
  const termeDiffere = useDebounce(terme);
  const url = termeDiffere.trim() ? construireUrlRecherche(termeDiffere) : null;
  const { donnees, chargement, erreur } = useFetch<ReponseRecherche>(url);
  const films: FilmOmdb[] =
    donnees?.Response === "True" ? donnees.Search ?? [] : [];
  const erreurRecherche =
    donnees?.Response === "False"
      ? donnees.Error ?? "La recherche a échoué."
      : erreur;

  const afficherEtatRecherche = () => {
    if (!termeDiffere.trim()) {
      return <p>Tapez un titre pour lancer la recherche.</p>;
    }

    if (chargement) {
      return <p>Chargement…</p>;
    }

    if (erreurRecherche) {
      return <p className="text-red-600">{erreurRecherche}</p>;
    }

    if (films.length === 0) {
      return <p>Aucun film ne correspond à « {termeDiffere} ».</p>;
    }

    return (
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {films.map((film) => (
          <li key={film.imdbID} className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="font-bold">{film.Title}</h2>
            <p className="text-sm text-slate-500">{film.Year}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold">Recherche de films</h1>
        <input
          className="w-full rounded-lg border border-slate-300 bg-white p-3"
          type="search"
          value={terme}
          onChange={(event) => setTerme(event.target.value)}
          placeholder="Rechercher un film"
          aria-label="Titre du film à rechercher"
        />

        {afficherEtatRecherche()}
      </div>
    </main>
  );
}

export default App;
