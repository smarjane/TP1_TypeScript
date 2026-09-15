import type { Film, StatutFilm } from "../lib/utils";
import Badge, { type TonBadge } from "./Badge";
import Bouton from "./Bouton";
import Carte from "./Carte";

export interface ListeFilmsProps {
  films: Film[];
  messageVide?: string;
  onSelection?: (film: Film) => void;
}

const correspondanceStatut: Record<StatutFilm, { libelle: string; ton: TonBadge }> = {
  vu: { libelle: "Déjà vu", ton: "succes" },
  a_voir: { libelle: "À voir", ton: "info" },
  abandonne: { libelle: "Abandonné", ton: "neutre" },
};

export default function ListeFilms({ films, messageVide, onSelection }: ListeFilmsProps) {
  if (films.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100 p-6 text-center text-slate-600">
        {messageVide ?? "Aucun film à afficher."}
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {films.map((film) => {
        const statut = correspondanceStatut[film.statut];

        return (
          <li key={film.id} className="list-none">
            <Carte
              titre={film.titre}
              sousTitre={`${film.annee} — ${film.note}/10`}
              actions={
                onSelection ? (
                  <Bouton libelle="Détails" onClick={() => onSelection(film)} />
                ) : undefined
              }
            >
              <div className="flex flex-wrap gap-2">
                <Badge texte={statut.libelle} ton={statut.ton} />
                {film.genres.map((genre) => (
                  <Badge key={`${film.id}-${genre}`} texte={genre} ton="info" />
                ))}
              </div>
            </Carte>
          </li>
        );
      })}
    </ul>
  );
}
