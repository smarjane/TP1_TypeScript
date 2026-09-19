import { useContext } from "react";
import { ContexteAuth, type AuthContexte } from "./AuthContextValue";

export function useAuth(): AuthContexte {
  const contexte = useContext(ContexteAuth);
  if (contexte === undefined) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  }
  return contexte;
}
