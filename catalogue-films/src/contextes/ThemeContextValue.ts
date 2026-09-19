import { createContext } from "react";

export type Theme = "clair" | "sombre";

export interface ThemeContexte {
  theme: Theme;
  basculer: () => void;
}

export const ContexteTheme = createContext<ThemeContexte | undefined>(undefined);
