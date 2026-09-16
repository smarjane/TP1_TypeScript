// src/composants/CarteFilm.tsx
//
// L'ADAPTATEUR demandé par la consigne 6. Il ne dessine presque rien :
// il traduit un film OMDB en props pour la Carte du TP2, qui n'est pas
// modifiée. C'est tout l'intérêt d'avoir fait une Carte générique.

import type { FilmOmdb } from "../lib/omdb";
import { afficheDisponible } from "../lib/omdb";
import { Carte } from "./Carte";
import { Badge } from "./Badge";

export interface CarteFilmProps {
  film: FilmOmdb;
}

// L'API ne renvoie que ces trois valeurs en pratique, mais Type est un
// string : on tolère l'inconnu plutôt que de mentir au compilateur.
const libelles: Record<string, string> = {
  movie: "Film",
  series: "Série",
  game: "Jeu",
};

export function CarteFilm({ film }: CarteFilmProps) {
  return (
    <Carte titre={film.Title} sousTitre={film.Year}>
      {afficheDisponible(film.Poster) ? (
        <img
          src={film.Poster}
          alt={`Affiche de ${film.Title}`}
          className="aspect-[2/3] w-full rounded object-cover"
        />
      ) : (
        <div className="flex aspect-[2/3] w-full items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
          Pas d'affiche
        </div>
      )}

      <p className="mt-2">
        <Badge texte={libelles[film.Type] ?? film.Type} ton="info" />
      </p>
    </Carte>
  );
}
