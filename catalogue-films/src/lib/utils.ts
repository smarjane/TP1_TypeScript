export type StatutFilm = "vu" | "a_voir" | "abandonne";
export type GenreFilm = "SF" | "Horreur" | "Thriller" | "Drame" | "Aventure";

export interface Film {
  id: number;
  titre: string;
  annee: number;
  genres: GenreFilm[];
  note: number;
  statut: StatutFilm;
}

export const FILMS: Film[] = [
  { id: 1, titre: "Alien", annee: 1979, genres: ["SF", "Horreur"], note: 8.5, statut: "vu" },
  { id: 2, titre: "Blade Runner", annee: 1982, genres: ["SF", "Thriller"], note: 8.1, statut: "vu" },
  { id: 3, titre: "Arrival", annee: 2016, genres: ["SF", "Drame"], note: 7.9, statut: "a_voir" },
  { id: 4, titre: "Dune", annee: 2021, genres: ["SF", "Aventure"], note: 8.0, statut: "a_voir" },
  { id: 5, titre: "Solaris", annee: 1972, genres: ["SF", "Drame"], note: 8.4, statut: "abandonne" },
];

export function trierPar(liste: Film[], cle: keyof Film): Film[] {
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
