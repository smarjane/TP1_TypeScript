import { createContext } from "react";
import type { FilmOmdb } from "../lib/omdb";

export interface FavorisContexte {
  favoris: FilmOmdb[];
  ajouter: (film: FilmOmdb) => void;
  retirer: (id: string) => void;
  vider: () => void;
}

export const ContexteFavoris = createContext<FavorisContexte | undefined>(undefined);
