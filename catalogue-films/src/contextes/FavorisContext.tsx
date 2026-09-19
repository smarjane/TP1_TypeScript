import { useEffect, useReducer } from "react";
import type { FilmOmdb } from "../lib/omdb";
import { ContexteFavoris } from "./FavorisContextValue";
import { useAuth } from "./useAuth";

type ActionFavoris =
  | { type: "ajouter"; film: FilmOmdb }
  | { type: "retirer"; id: string }
  | { type: "vider" }
  | { type: "charger"; pseudo: string | null; favoris: FilmOmdb[] };

interface EtatFavoris {
  pseudo: string | null;
  favoris: FilmOmdb[];
}

function casImpossible(action: never): never {
  throw new Error(`Action inconnue : ${JSON.stringify(action)}`);
}

function reducerFavoris(etat: EtatFavoris, action: ActionFavoris): EtatFavoris {
  switch (action.type) {
    case "ajouter": {
      if (etat.favoris.some((film) => film.imdbID === action.film.imdbID)) {
        return etat;
      }
      return { ...etat, favoris: [...etat.favoris, action.film] };
    }
    case "retirer":
      return {
        ...etat,
        favoris: etat.favoris.filter((film) => film.imdbID !== action.id),
      };
    case "vider":
      return { ...etat, favoris: [] };
    case "charger":
      return { pseudo: action.pseudo, favoris: action.favoris };
    default:
      return casImpossible(action);
  }
}

export function FavorisProvider({ children }: { children: React.ReactNode }) {
  const { pseudo } = useAuth();
  const [etat, dispatch] = useReducer(reducerFavoris, pseudo, (pseudoInitial) => ({
    pseudo: pseudoInitial,
    favoris: lireFavoris(pseudoInitial),
  }));

  useEffect(() => {
    if (etat.pseudo !== pseudo) {
      dispatch({
        type: "charger",
        pseudo,
        favoris: lireFavoris(pseudo),
      });
    }
  }, [etat.pseudo, pseudo]);

  useEffect(() => {
    if (pseudo !== null && etat.pseudo === pseudo) {
      localStorage.setItem(cleFavoris(pseudo), JSON.stringify(etat.favoris));
    }
  }, [etat, pseudo]);

  function ajouter(film: FilmOmdb) {
    dispatch({ type: "ajouter", film });
  }

  function retirer(id: string) {
    dispatch({ type: "retirer", id });
  }

  function vider() {
    dispatch({ type: "vider" });
  }

  return (
    <ContexteFavoris.Provider value={{ favoris: etat.favoris, ajouter, retirer, vider }}>
      {children}
    </ContexteFavoris.Provider>
  );
}

function cleFavoris(pseudo: string): string {
  return `favoris-catalogue-${encodeURIComponent(pseudo)}`;
}

function lireFavoris(pseudo: string | null): FilmOmdb[] {
  if (pseudo === null) {
    return [];
  }

  const brut = localStorage.getItem(cleFavoris(pseudo));
  if (!brut) {
    return [];
  }

  try {
    const donnees = JSON.parse(brut) as FilmOmdb[];
    return Array.isArray(donnees) ? donnees : [];
  } catch {
    return [];
  }
}
