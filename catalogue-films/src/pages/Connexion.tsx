import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contextes/useAuth";
import Bouton from "../composants/Bouton";

export default function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const emplacement = useLocation();

  function valider(e: React.FormEvent) {
    e.preventDefault();
    const pseudoValide = pseudo.trim();
    if (pseudoValide === "") {
      return;
    }

    connecter(pseudoValide);
    const destination = (emplacement.state as { de?: { pathname: string } } | null)?.de?.pathname ?? "/";
    navigate(destination, { replace: true });
  }

  return (
    <form onSubmit={valider} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold">Connexion</h2>

      <input
        type="text"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        placeholder="Votre pseudo"
        className="border p-2 w-full rounded"
      />

      <Bouton type="submit" libelle="Se connecter" />
    </form>
  );
}
