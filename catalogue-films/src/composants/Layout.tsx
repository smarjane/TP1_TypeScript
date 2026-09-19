import { NavLink, Outlet } from "react-router-dom";
import Bouton from "./Bouton";
import { useAuth } from "../contextes/useAuth";
import { useFavoris } from "../contextes/useFavoris";
import { useTheme } from "../contextes/useTheme";

export default function Layout() {
  const { pseudo, deconnecter } = useAuth();
  const { favoris } = useFavoris();
  const { theme, basculer } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <header className="bg-white shadow p-4 flex items-center justify-between gap-4 dark:bg-slate-800 dark:text-slate-100">
        <h1 className="text-xl font-bold">Catalogue de films</h1>

        <nav className="flex items-center gap-4 flex-wrap">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-slate-600 dark:text-slate-200"
            }
          >
            Accueil
          </NavLink>

          <NavLink
            to="/recherche"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-slate-600 dark:text-slate-200"
            }
          >
            Recherche
          </NavLink>

          <NavLink
            to="/favoris"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-slate-600 dark:text-slate-200"
            }
          >
            Favoris ({pseudo ? favoris.length : 0})
          </NavLink>

          {pseudo ? (
            <>
              <span className="text-sm text-slate-700 dark:text-slate-200">
                Connecté en tant que <strong>{pseudo}</strong>
              </span>
              <Bouton libelle="Déconnexion" variante="secondaire" onClick={deconnecter} />
            </>
          ) : (
            <NavLink
              to="/connexion"
              className={({ isActive }) =>
                isActive ? "font-bold text-blue-600" : "text-slate-600 dark:text-slate-200"
              }
            >
              Connexion
            </NavLink>
          )}

          <Bouton
            libelle={theme === "sombre" ? "Mode clair" : "Mode sombre"}
            variante="secondaire"
            onClick={basculer}
          />
        </nav>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="bg-slate-200 p-4 text-center dark:bg-slate-800 dark:text-slate-100">
        <p className="text-sm text-slate-700 dark:text-slate-200">catalogue de films</p>
      </footer>
    </div>
  );
}
