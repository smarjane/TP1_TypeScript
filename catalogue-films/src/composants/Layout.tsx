import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">

      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">Catalogue de films</h1>

        <nav className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-slate-600"
            }
          >
            Accueil
          </NavLink>

          <NavLink
            to="/recherche"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-slate-600"
            }
          >
            Recherche
          </NavLink>

          <NavLink
            to="/connexion"
            className={({ isActive }) =>
              isActive ? "font-bold text-blue-600" : "text-slate-600"
            }
          >
            Connexion
          </NavLink>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="bg-slate-200 p-4 text-center">
        <p className="text-sm text-slate-700">catalogue de films</p>
      </footer>
    </div>
  );
}
