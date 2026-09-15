import { useEffect, useState } from "react";
import { construireUrlRecherche, type FilmOmdb, type ReponseRecherche } from "./lib/omdb";

function App() {
  const [terme, setTerme] = useState("");
  const [films, setFilms] = useState<FilmOmdb[]>([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!terme.trim()) {
      return;
    }

    const controleur = new AbortController();

    const rechercherFilms = async () => {
      setChargement(true);
      setErreur(null);

      try {
        const reponse = await fetch(construireUrlRecherche(terme), {
          signal: controleur.signal,
        });

        if (!reponse.ok) {
          throw new Error(`Erreur HTTP ${reponse.status}`);
        }

        const donnees: ReponseRecherche = await reponse.json();

        if (donnees.Response === "False") {
          throw new Error(donnees.Error ?? "La recherche a échoué.");
        }

        setFilms(donnees.Search ?? []);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") {
          return;
        }

        setErreur(e instanceof Error ? e.message : "Erreur inconnue");
        setFilms([]);
      } finally {
        if (!controleur.signal.aborted) {
          setChargement(false);
        }
      }
    };

    rechercherFilms();

    return () => controleur.abort();
  }, [terme]);

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

        {!terme.trim() ? (
          <p>Tapez un titre pour lancer la recherche.</p>
        ) : chargement ? (
          <p>Chargement...</p>
        ) : erreur ? (
          <p className="text-red-600">{erreur}</p>
        ) : films.length === 0 ? (
          <p>Aucun film ne correspond à « {terme} ».</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {films.map((film) => (
              <li key={film.imdbID} className="rounded-lg bg-white p-4 shadow-sm">
                <h2 className="font-bold">{film.Title}</h2>
                <p className="text-sm text-slate-500">{film.Year}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default App;
