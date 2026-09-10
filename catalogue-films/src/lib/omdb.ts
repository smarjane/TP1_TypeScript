import { useState } from 'react';

const [films, setFilms] = useState<FilmOmdb[]>([]);
const [chargement, setChargement] = useState(false);
const [erreur, setErreur] = useState<string | null>(null);

export interface FilmOmdb {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;      // "movie" | "series" | "game" — l'API n'est pas plus précise
  Poster: string;    // une URL, ou la chaîne "N/A"
}

export interface ReponseRecherche {
  Search?: FilmOmdb[];       // absent quand la recherche échoue
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}