import { useState } from "react";
import FormulaireInscription from "./composants/FormulaireInscription";
import ListeInscriptions from "./composants/ListeInscriptions";
import type { Inscription, InscriptionEnregistree } from "./lib/inscription";

function App() {
  const [inscriptions, setInscriptions] = useState<InscriptionEnregistree[]>([]);

  const gererAjout = (donnees: Inscription) => {
    const nouvelleInscription: InscriptionEnregistree = {
      id: Date.now(),
      prenom: donnees.prenom,
      email: donnees.email,
      cgv: donnees.cgv,
    };

    setInscriptions((liste) => [nouvelleInscription, ...liste]);
  };

  const gererSuppression = (id: number) => {
    setInscriptions((liste) => liste.filter((inscription) => inscription.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <FormulaireInscription onInscription={gererAjout} />
        <ListeInscriptions inscriptions={inscriptions} onSuppression={gererSuppression} />
      </div>
    </main>
  );
}

export default App;
