import { useState, type ChangeEvent, type FormEvent } from "react";
import Bouton from "./Bouton";
import ChampTexte from "./ChampTexte";
import Carte from "./Carte";
import { type Erreurs, type Inscription, valeursInitiales, valider } from "../lib/inscription";

export interface FormulaireInscriptionProps {
  onInscription: (donnees: Inscription) => void;
}

export default function FormulaireInscription({ onInscription }: FormulaireInscriptionProps) {
  const [donnees, setDonnees] = useState<Inscription>(valeursInitiales);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const gererSaisie = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const nouvelleValeur = type === "checkbox" ? checked : value;

    setDonnees((d) => ({
      ...d,
      [name]: nouvelleValeur,
    }));
  };

  const gererEnvoi = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trouvees = valider(donnees);
    setErreurs(trouvees);

    if (Object.keys(trouvees).length > 0) {
      return;
    }

    setEnvoiEnCours(true);

    window.setTimeout(() => {
      onInscription(donnees);
      setDonnees(valeursInitiales);
      setErreurs({});
      setEnvoiEnCours(false);
    }, 400);
  };

  return (
    <Carte titre="Inscription">
      <form noValidate onSubmit={gererEnvoi} className="space-y-4">
        <ChampTexte
          nom="prenom"
          label="Prénom"
          valeur={donnees.prenom}
          onChange={gererSaisie}
          erreur={erreurs.prenom}
          placeholder="Jean"
        />

        <ChampTexte
          nom="email"
          label="Email"
          valeur={donnees.email}
          onChange={gererSaisie}
          type="email"
          erreur={erreurs.email}
          placeholder="jean@mail.com"
        />

        <ChampTexte
          nom="motDePasse"
          label="Mot de passe"
          valeur={donnees.motDePasse}
          onChange={gererSaisie}
          type="password"
          erreur={erreurs.motDePasse}
          placeholder="********"
        />

        <ChampTexte
          nom="confirmation"
          label="Confirmation"
          valeur={donnees.confirmation}
          onChange={gererSaisie}
          type="password"
          erreur={erreurs.confirmation}
          placeholder="********"
        />

        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            name="cgv"
            checked={donnees.cgv}
            onChange={gererSaisie}
            aria-invalid={Boolean(erreurs.cgv)}
            aria-describedby={erreurs.cgv ? "cgv-erreur" : undefined}
            className="mt-1"
          />
          <span>J’accepte les conditions générales de vente.</span>
        </label>

        {erreurs.cgv ? (
          <p id="cgv-erreur" className="text-sm text-red-600">
            {erreurs.cgv}
          </p>
        ) : null}

        <Bouton
          libelle={envoiEnCours ? "Envoi en cours…" : "Valider"}
          type="submit"
          desactive={envoiEnCours}
        />
      </form>
    </Carte>
  );
}
