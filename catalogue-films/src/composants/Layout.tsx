import { Routes, Route } from "react-router-dom";


function Layout(){
  return(
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