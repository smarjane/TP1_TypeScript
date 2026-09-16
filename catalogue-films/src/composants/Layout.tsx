<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";
=======
import { Link, NavLink } from "react-router-dom";

>>>>>>> 11f1425 (sauvegarde avant pull)


function Layout(){
  return(
<<<<<<< HEAD
    <Entete />
    <Outlet />
    <PiedDePage />
  )
}

<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Accueil />} />
    <Route path="recherche" element={<Recherche />} />
    <Route path="films/:id" element={<DetailFilm />} />
    <Route path="connexion" element={<Connexion />} />
    <Route path="*" element={<PageIntrouvable />} />
  </Route>
</Routes>
=======
    <>
    
    <Entete />
    <NavLink
      to="/recherche"
      className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "text-slate-600")}
    >
      Recherche
    </NavLink>
    
    <Outlet />
    <PiedDePage />
    
    </>
  )
}


>>>>>>> 11f1425 (sauvegarde avant pull)
