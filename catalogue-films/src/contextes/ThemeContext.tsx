import { useEffect, useState } from "react";
import { ContexteTheme, type Theme } from "./ThemeContextValue";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const prefer = localStorage.getItem("theme-catalogue");
    return prefer === "sombre" ? "sombre" : "clair";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "sombre");
    localStorage.setItem("theme-catalogue", theme);
  }, [theme]);

  function basculer() {
    setTheme((themeActuel) => (themeActuel === "sombre" ? "clair" : "sombre"));
  }

  return (
    <ContexteTheme.Provider value={{ theme, basculer }}>
      {children}
    </ContexteTheme.Provider>
  );
}
