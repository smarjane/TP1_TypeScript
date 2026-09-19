import { useContext } from "react";
import { ContexteTheme, type ThemeContexte } from "./ThemeContextValue";

export function useTheme(): ThemeContexte {
  const contexte = useContext(ContexteTheme);
  if (contexte === undefined) {
    throw new Error("useTheme doit être utilisé dans un <ThemeProvider>");
  }
  return contexte;
}
