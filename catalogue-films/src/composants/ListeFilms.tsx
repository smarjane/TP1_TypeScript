import type { film, statut } from "../lib/utils";
import Carte from "./Carte";
import Badge from "./Badge";
import Bouton from "./Bouton";
import type { TonBadge } from "./Badge"; //type jamais inclu ds import donc on import ceux qu'on a besoin

export interface ListeFilmsProps {
  films: film[];
  messageVide?: string;
  onSelection?: (film: film) => void;
}

const correspondanceStatut: Record<statut, { label: string; ton: TonBadge }> = {
  vu: { label: "Déjà vu", ton: "succes" },
  a_voir: { label: "À voir", ton: "info" },
  abandonne: { label: "Abandonné", ton: "neutre" },
};

export default function ListeFilms({ films, messageVide, onSelection }: ListeFilmsProps) {
  if (films.length === 0) {
    return <p>{messageVide}</p>;
  }

  return (
    <ul className="grid">
      {films.map((film) => {
        const statut = correspondanceStatut[film.statut];

        return (
          <li key={film.id}>
            <Carte
              titre={film.titre}
              sousTitre={`${film.annee} — ${film.note}/10`}
              actions={
                onSelection ? (
                <Bouton libelle="détails" onClick={() => onSelection(film)} />
                ) : undefined
              }
            >
          
              <Badge ton={statut.ton}>{statut.label}</Badge>

        
              {film.genres.map((g) => (
                <Badge key={g} ton="info">
                  {g}
                </Badge>
              ))}
            </Carte>
          </li>
        );
      })}
    </ul>
  );
}
