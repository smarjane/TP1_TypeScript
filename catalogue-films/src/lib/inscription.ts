export interface Inscription {
  prenom: string;
  email: string;
  motDePasse: string;
  confirmation: string;
  cgv: boolean;
}

export const valeursInitiales: Inscription = {
  prenom: "",
  email: "",
  motDePasse: "",
  confirmation: "",
  cgv: false,
};

export type Erreurs = Partial<Record<keyof Inscription, string>>;

export type InscriptionEnregistree = Omit<Inscription, "motDePasse" | "confirmation"> & {
  id: number;
};

export function valider(donnees: Inscription): Erreurs {
  const erreurs: Erreurs = {};

  if (donnees.prenom.trim().length < 2) {
    erreurs.prenom = "Le prénom doit contenir au moins 2 caractères.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donnees.email.trim())) {
    erreurs.email = "L'email est invalide.";
  }

  if (donnees.motDePasse.length < 8) {
    erreurs.motDePasse = "Le mot de passe doit contenir au moins 8 caractères.";
  }

  if (donnees.motDePasse !== donnees.confirmation) {
    erreurs.confirmation = "La confirmation ne correspond pas.";
  }

  if (!donnees.cgv) {
    erreurs.cgv = "Vous devez accepter les CGV.";
  }

  return erreurs;
}


