import { useContext } from "react";
import { ContexteFavoris, type FavorisContexte } from "./FavorisContextValue";

export function useFavoris(): FavorisContexte {
  const contexte = useContext(ContexteFavoris);
  if (contexte === undefined) {
    throw new Error("useFavoris doit être utilisé dans un <FavorisProvider>");
  }
  return contexte;
}
