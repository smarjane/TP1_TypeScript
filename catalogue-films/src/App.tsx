import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import Layout from "./composants/Layout";
import { useAuth } from "./contextes/useAuth";
import Accueil from "./pages/Accueil";
import Recherche from "./pages/Recherche";
import DetailFilm from "./pages/DetailFilm";
import Connexion from "./pages/Connexion";
import PageIntrouvable from "./pages/PageIntrouvable";
import Favoris from "./pages/Favoris";

function RouteProtegee({ children }: { children: ReactNode }) {
  const { pseudo } = useAuth();
  const emplacement = useLocation();

  if (!pseudo) {
    return <Navigate to="/connexion" state={{ de: emplacement }} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Accueil />} />
        <Route path="recherche" element={<Recherche />} />
        <Route path="films/:id" element={<DetailFilm />} />
        <Route path="connexion" element={<Connexion />} />
        <Route path="favoris" element={<RouteProtegee><Favoris /></RouteProtegee>} />
        <Route path="*" element={<PageIntrouvable />} />
      </Route>
    </Routes>
  );
}

export default App;
