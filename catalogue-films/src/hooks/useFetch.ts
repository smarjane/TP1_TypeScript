import { useEffect, useState } from "react";

export interface EtatFetch<T> {
  donnees: T | null;
  chargement: boolean;
  erreur: string | null;
}

export function useFetch<T>(url: string | null): EtatFetch<T> {
  const [donnees, setDonnees] = useState<T | null>(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      const id = window.setTimeout(() => {
        setDonnees(null);
        setErreur(null);
        setChargement(false);
      }, 0);

      return () => window.clearTimeout(id);
    }

    const controleur = new AbortController();

    const charger = async () => {
      setChargement(true);
      setErreur(null);

      try {
        const reponse = await fetch(url, { signal: controleur.signal });

        if (!reponse.ok) {
          throw new Error(`Erreur HTTP ${reponse.status}`);
        }

        const donneesRecues: T = await reponse.json();
        setDonnees(donneesRecues);
      } catch (e: unknown) {
        if (e instanceof Error && e.name === "AbortError") {
          return;
        }

        setErreur(e instanceof Error ? e.message : "Erreur inconnue");
        setDonnees(null);
      } finally {
        if (!controleur.signal.aborted) {
          setChargement(false);
        }
      }
    };

    charger();

    return () => controleur.abort();
  }, [url]);

  return { donnees, chargement, erreur };
}

export function useDebounce<T>(valeur: T, delai = 400): T {
  const [differee, setDifferee] = useState(valeur);

  useEffect(() => {
    const id = window.setTimeout(() => setDifferee(valeur), delai);
    return () => window.clearTimeout(id);
  }, [valeur, delai]);

  return differee;
}
