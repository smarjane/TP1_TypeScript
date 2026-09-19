import { useEffect, useState } from "react";
import { ContexteAuth } from "./AuthContextValue";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [pseudo, setPseudo] = useState<string | null>(() => {
    const valeur = localStorage.getItem("pseudo-catalogue");
    return valeur ?? null;
  });

  useEffect(() => {
    if (pseudo) {
      localStorage.setItem("pseudo-catalogue", pseudo);
      return;
    }
    localStorage.removeItem("pseudo-catalogue");
  }, [pseudo]);

  function connecter(nouveauPseudo: string) {
    setPseudo(nouveauPseudo.trim());
  }

  function deconnecter() {
    setPseudo(null);
  }

  return (
    <ContexteAuth.Provider value={{ pseudo, connecter, deconnecter }}>
      {children}
    </ContexteAuth.Provider>
  );
}
