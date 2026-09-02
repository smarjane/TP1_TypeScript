// =====================================================================
//  utils.js — Catalogue de films
//  TP1 — React.js & TypeScript
//
//  Ce module fonctionne parfaitement en JavaScript.
//  Votre travail : le renommer en utils.ts et le faire passer en mode
//  strict, sans utiliser `any`, jusqu'à ce que `npx tsc --noEmit` se
//  taise complètement.
//
//  Traitez les erreurs UNE PAR UNE, dans l'ordre où le compilateur les
//  donne. Chaque bloc numéroté ci-dessous cache un problème différent.
// =====================================================================

// --- Données de démonstration ----------------------------------------
type statut = "vu" | "a_voir" | "abandonne"
type genre = "SF" | "Horreur" | "Thriller" | "Drame" | "Aventure"

interface film {
  id: number
  titre: string
  annee: number
  note: number
  genres: genre[]
  statut:statut
}

export const FILMS:film[]= [
  { id: 1, titre: "Alien", annee: 1979, genres: ["SF", "Horreur"], note: 8.5, statut: "vu" },
  { id: 2, titre: "Blade Runner", annee: 1982, genres: ["SF", "Thriller"], note: 8.1, statut: "vu" },
  { id: 3, titre: "Arrival", annee: 2016, genres: ["SF", "Drame"], note: 7.9, statut: "a_voir" },
  { id: 4, titre: "Dune", annee: 2021, genres: ["SF", "Aventure"], note: 8.0, statut: "a_voir" },
  { id: 5, titre: "Solaris", annee: 1972, genres: ["SF", "Drame"], note: 8.4, statut: "abandonne" },
];

// --- 1. Paramètres non typés -----------------------------------------
// Le mode strict interdit les paramètres au type implicite.

export function formaterTitre(titre: string, annee: number): string {
  return `${titre} (${annee})`;
}

export function resume(film: film): string{
  return `${film.titre} — ${film.annee} — ${film.note}/10 — ${film.genres.join(", ")}`;
}

// --- 2. Un retour de type variable ------------------------------------
// Cette fonction renvoie tantôt un nombre, tantôt une chaîne.
// Quel type déclarer ? Et surtout : que devra faire celui qui l'appelle ?

export function moyenne(notes: number[]): number | string {
  if (notes.length === 0) return "Aucune note";
  const total = notes.reduce((a, b) => a + b, 0);
  return total / notes.length;
}

// --- 3. Une recherche qui peut échouer --------------------------------
// find() renvoie undefined quand rien ne correspond.
// La deuxième fonction l'ignore complètement.

export function trouverParId(liste: film[], id: number): undefined | film {
  return liste.find((film) => film.id === id);
}

export function titreDuFilm(liste: film[], id: number): string | undefined {
  return trouverParId(liste, id)?.titre;
}

// --- 4. Un tri générique ----------------------------------------------
// On trie par une clé passée en paramètre. Rien ne garantit que cette
// clé existe sur les objets de la liste.

export function trierPar(liste : film[], cle: keyof(film)): film[] {
  return [...liste].sort((a, b) => (a[cle] > b[cle] ? 1 : -1));
}

// --- 5. Un paramètre optionnel jamais vérifié -------------------------
// Appelée sans genre, cette fonction filtre sur `undefined`.

export function filtrerParGenre(liste: film[], genre?: genre): film[] {
  if (genre !== undefined) {
    return liste.filter((film) => film.genres.includes(genre));
  }
  return liste
}

// --- 6. Un statut libre ------------------------------------------------
// `statut` est une chaîne quelconque : rien n'empêche d'écrire "Vu",
// "vue" ou "à voir". Une faute de frappe passe inaperçue.

type StatutFilm = "vu" | "a_voir" | "abandonne";

type FilmAvecStatut = {
  statut: StatutFilm;
};

export function estVu(film: FilmAvecStatut): boolean {
  return film.statut === "vu";
}

export function libelleStatut(film: FilmAvecStatut): string {
  if (film.statut === "vu") return "Déjà vu";
  if (film.statut === "a_voir") return "À voir";
  if (film.statut === "abandonne") return "Abandonné";
  return "Statut inconnu";
}

// --- 7. Une valeur venue de l'extérieur --------------------------------
// localStorage.getItem renvoie null quand la clé n'existe pas.

export function chargerFavoris(): number[] | null {
  const brut = localStorage.getItem("favoris");
  if (brut === null) return null;
  return JSON.parse(brut);
}

export function enregistrerFavoris(favoris: number[]) {
  localStorage.setItem("favoris", JSON.stringify(favoris));
}

// --- 8. Une mise à jour partielle --------------------------------------
// On veut pouvoir modifier un ou plusieurs champs d'un film, sans avoir
// à tous les repasser. Quel type décrit « quelques champs de Film » ?

export function mettreAJour(film : film, modifications: Partial<film>): film {
  return { ...film, ...modifications };
}

// --- 9. Une création sans identifiant ----------------------------------
// À la création, l'id n'existe pas encore : c'est le serveur qui le
// fournira. Quel type décrit « un Film sans son id » ?

let prochainId = 100;

export function creer(nouveauFilm: Omit<film, "id">): film {
  return { id: prochainId++, ...nouveauFilm };
}

// --- 10. Une mutation silencieuse --------------------------------------
// Cette fonction modifie l'objet reçu au lieu d'en renvoyer un nouveau.
// Le typage ne l'interdira pas — mais `readonly` peut aider.

export function ajouterNote(film : Readonly<film>, nouvelleNote : number): film {
  return { ...film, note: (film.note + nouvelleNote) / 2 };
}
