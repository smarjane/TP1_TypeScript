export interface FilmOmdb {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface ReponseRecherche {
  Search?: FilmOmdb[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

export function construireUrlRecherche(terme: string): string {
  const cleApi = import.meta.env.VITE_OMDB_KEY;
  const termeEncode = encodeURIComponent(terme);

  return `https://www.omdbapi.com/?apikey=${cleApi}&s=${termeEncode}`;
}

export function creerExempleRecherche(): ReponseRecherche {
  return {
    Response: "True",
    totalResults: "1",
    Search: [
      {
        imdbID: "tt0083658",
        Title: "Blade Runner",
        Year: "1982",
        Type: "movie",
        Poster: "https://example.com/poster.jpg",
      },
    ],
  };
}

export function estErreurRecherche(reponse: ReponseRecherche): boolean {
  return reponse.Response === "False" || Boolean(reponse.Error);
}