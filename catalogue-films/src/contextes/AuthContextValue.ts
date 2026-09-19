import { createContext } from "react";

export interface AuthContexte {
  pseudo: string | null;
  connecter: (pseudo: string) => void;
  deconnecter: () => void;
}

export const ContexteAuth = createContext<AuthContexte | undefined>(undefined);
