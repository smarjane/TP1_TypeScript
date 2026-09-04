export type VarianteBouton = "primaire" | "secondaire" | "danger";

export interface BoutonProps {
  libelle: string;
  variante?: VarianteBouton;   // "primaire" par défaut
  desactive?: boolean;         // false par défaut
  onClick?: () => void;
}

function Bouton({libelle, variante = "primaire"} : BoutonProps){

}


<Bouton libelle="Valider" />
<Bouton libelle="Supprimer" variante="danger" onClick={supprimer} />
<Bouton libelle="Indisponible" desactive />