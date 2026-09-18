export type StatutFilm = "vu" | "a_voir" | "abandonne";
export type GenreFilm = "SF" | "Horreur" | "Thriller" | "Drame" | "Aventure" | "Comedie";

export interface Film {
  readonly id: number;
  imdbID: string
  titre: string;
  annee: number;
  genres: GenreFilm[];
  note: number;
  statut: StatutFilm;
  
}

export const FILMS: Film[] = [
  { id: 1, imdbID: "1", titre: "Alien", annee: 1979, genres: ["SF", "Horreur"], note: 8.5, statut: "vu" },
  { id: 2, imdbID: "2", titre: "Blade Runner", annee: 1982, genres: ["SF", "Thriller"], note: 8.1, statut: "vu" },
  { id: 3, imdbID: "3", titre: "Arrival", annee: 2016, genres: ["SF", "Drame"], note: 7.9, statut: "a_voir" },
  { id: 4, imdbID: "4", titre: "Dune", annee: 2021, genres: ["SF", "Aventure"], note: 8.0, statut: "a_voir" },
  { id: 5, imdbID: "5", titre: "Solaris", annee: 1972, genres: ["SF", "Drame"], note: 8.4, statut: "abandonne" },
];

export function trierPar<T>(liste: T[], cle: keyof T): T[] {
  return [...liste].sort((a, b) => {
    const valeurA = a[cle];
    const valeurB = b[cle];

    if (valeurA < valeurB) return -1;
    if (valeurA > valeurB) return 1;
    return 0;
  });
}

export function filtrerParGenre(liste: Film[], genre?: GenreFilm): Film[] {
  if (genre === undefined) {
    return liste;
  }

  return liste.filter((film) => film.genres.includes(genre));
}

export function libelleStatut(film: Film): string {
  switch (film.statut) {
    case "vu":
      return "Déjà vu";
    case "a_voir":
      return "À voir";
    case "abandonne":
      return "Abandonné";
  }
}

export function trouverFilm(liste: Film[], id: number): Film | undefined {
  return liste.find((film) => film.id === id);
}

export function noteOuTitre(film: Film, afficherNote: boolean): string | number {
  return afficherNote ? film.note : film.titre;
}

export function lireIdsSauvegardes(): number[] {
  const brut = localStorage.getItem("films-selectionnes");
  if (brut === null) {
    return [];
  }

  return JSON.parse(brut) as number[];
}

export function mettreAJourFilm(film: Film, changements: Partial<Omit<Film, "id">>): Film {
  return { ...film, ...changements };
}

export function creerFilm(donnees: Omit<Film, "id">, id: number): Film {
  return { id, ...donnees };
}

export function remplacerFilm(film: Readonly<Film>, changements: Partial<Omit<Film, "id">>): Film {
  return { ...film, ...changements };
}
