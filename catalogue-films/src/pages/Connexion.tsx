import { useState } from "react";
import { useAuth } from "../contextes/AuthContext";
import Bouton from "../composants/Bouton";

export default function Connexion() {
  const [pseudo, setPseudo] = useState("");
  const { connecter } = useAuth();

  function valider(e: React.FormEvent) {
    e.preventDefault();
    if (pseudo.trim() !== "") {
      connecter(pseudo);
    }
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

      <Bouton type="submit" libelle="Se connecter"/>
    </form>
  );
}
