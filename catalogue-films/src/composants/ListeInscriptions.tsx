import type { InscriptionEnregistree } from "../lib/inscription";
import Badge from "./Badge";
import Bouton from "./Bouton";
import Carte from "./Carte";

export interface ListeInscriptionsProps {
  inscriptions: InscriptionEnregistree[];
  onSuppression?: (id: number) => void;
}

export default function ListeInscriptions({ inscriptions, onSuppression }: ListeInscriptionsProps) {
  if (inscriptions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-100 p-6 text-center text-slate-600">
        Aucune inscription pour le moment.
      </div>
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-1">
      {inscriptions.map((inscription) => (
        <li key={inscription.id} className="list-none">
          <Carte
            titre={inscription.prenom}
            sousTitre={inscription.email}
            actions={
              onSuppression ? (
                <Bouton libelle="Supprimer" variante="danger" onClick={() => onSuppression(inscription.id)} />
              ) : undefined
            }
          >
            <Badge texte="CGV acceptées" ton="succes" />
          </Carte>
        </li>
      ))}
    </ul>
  );
}
