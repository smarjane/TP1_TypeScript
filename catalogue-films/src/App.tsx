import FormulaireInscription from "./composants/FormulaireInscription";
import ListeInscriptions from "./composants/ListeInscriptions";
import ListeFilms from "./composants/ListeFilms";
import RechercheFilms from "./composants/RechercheFilms";
import type { Inscription, InscriptionEnregistree } from "./lib/inscription";
import { FILMS, filtrerParGenre, trierPar } from "./lib/utils";

import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import {type FilmAvecStatut} from './lib/utils.ts'//R acco car ps export edfault mais nommé
import { Routes, Route } from "react-router-dom";


export function FILMStatut({titre, statut} : FilmAvecStatut ){
  return (
    <div>
      <h2>{titre}</h2>
      <h3>{statut}</h3>
    </div>
  )
}

const films: FilmAvecStatut[] = [
  { titre: "Game of thrones", statut: "vu" },
  { titre: "Gossip girl", statut: "a_voir" },
  { titre: "Vampire diares", statut: "abandonne" },
];



function App() {
  const [inscriptions, setInscriptions] = useState<InscriptionEnregistree[]>([]);

  const gererAjout = (donnees: Inscription) => {
    const nouvelleInscription: InscriptionEnregistree = {
      id: Date.now(),
      prenom: donnees.prenom,
      email: donnees.email,
      cgv: donnees.cgv,
    };

    setInscriptions((liste) => [nouvelleInscription, ...liste]);
  };

  const gererSuppression = (id: number) => {
    setInscriptions((liste) => liste.filter((inscription) => inscription.id !== id));
  };

  return (

    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Catalogue de films</h1>
          <p className="mt-2 text-slate-600">Un catalogue typé et une recherche OMDB.</p>
        </header>

    
    
    <>
    <div>

    <Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Accueil />} />
    <Route path="recherche" element={<Recherche />} />
    <Route path="films/:id" element={<DetailFilm />} />
    <Route path="connexion" element={<Connexion />} />
    <Route path="*" element={<PageIntrouvable />} />
  </Route>
</Routes>

    </div>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started </h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Catalogue local</h2>
          <ListeFilms films={trierPar(FILMS, "titre")} />
          <h3 className="text-xl font-semibold text-slate-900">Films de science-fiction</h3>
          <ListeFilms films={filtrerParGenre(FILMS, "SF")} />
          <h3 className="text-xl font-semibold text-slate-900">Genre inexistant</h3>
          <ListeFilms films={filtrerParGenre(FILMS, "Comedie")} messageVide="Aucun film pour ce genre." />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <FormulaireInscription onInscription={gererAjout} />
          <ListeInscriptions inscriptions={inscriptions} onSuppression={gererSuppression} />
        </section>

        <RechercheFilms />
      </div>
    </main>
  );
}

export default App;
