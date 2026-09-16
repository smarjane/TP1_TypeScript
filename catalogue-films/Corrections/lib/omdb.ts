// src/lib/omdb.ts
//
// La version du TP4, augmentée de ce qu'il faut pour la page de détail.
// Tout ce qui décrit l'API OMDB est ici : les types des réponses et la
// construction des URL. Aucun composant, aucun hook — ce fichier ne sait
// rien de React.

// Le type s'appelle FilmOmdb et non Film : le TP1 exporte déjà un Film,
// et deux types du même nom dans un même projet finissent toujours par
// être importés l'un pour l'autre.
export interface FilmOmdb {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;      // "movie" | "series" | "game" — l'API n'est pas plus précise
  Poster: string;    // une URL, ou la chaîne "N/A"
}

export interface ReponseRecherche {
  Search?: FilmOmdb[];
  totalResults?: string;
  Response: "True" | "False";   // OMDB répond 200 même quand ça échoue
  Error?: string;
}

// La recherche (?s=) et le détail (?i=) ne renvoient PAS la même chose :
// la recherche donne cinq champs par film, le détail en donne vingt.
// D'où un second type, qui étend le premier.
export interface FilmDetailOmdb extends FilmOmdb {
  Rated: string;
  Runtime: string;      // "142 min", ou "N/A"
  Genre: string;        // "Drama, Crime" — une chaîne, pas un tableau
  Director: string;
  Actors: string;
  Plot: string;
  imdbRating: string;   // "9.3", ou "N/A" — un string, toujours
  Response: "True" | "False";
  Error?: string;
}

const CLE = import.meta.env.VITE_OMDB_KEY;
const BASE = "https://www.omdbapi.com/";

/** URL de recherche par titre. Le terme est encodé : sans cela, un
 *  espace ou un accent casse la requête. */
export function urlRecherche(terme: string): string {
  return `${BASE}?apikey=${CLE}&s=${encodeURIComponent(terme)}`;
}

/** URL de détail par imdbID. plot=short suffit ici. */
export function urlDetail(id: string): string {
  return `${BASE}?apikey=${CLE}&i=${encodeURIComponent(id)}&plot=short`;
}

/** L'API renvoie "N/A" quand il n'y a pas d'affiche : ce n'est pas une
 *  URL, et un <img> dessus afficherait une icône cassée. */
export function afficheDisponible(poster: string): boolean {
  return poster !== "N/A" && poster.startsWith("http");
}
