import {useState} from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";


export interface Inscription {
  prenom: string;
  email: string;
  motDePasse: string;
  confirmation: string;
  cgv: boolean;
}

export const valeursInitiales: Inscription = {prenom: "", email: "", motDePasse: "", confirmation: "", cgv: true };

export type Erreurs = Partial<Record<keyof Inscription, string>>;

export function valider(donnees: Inscription): Erreurs {
    const erreurs: Erreurs = {}
  
    if (donnees.prenom.trim().length < 2) {
    erreurs.prenom = "au - 2 caractères";
  }
  

 }



 const erreurs = valider(donnees);
 
 if (Object.keys(erreurs).length === 0) {
 }



