// src/composants/Bouton.tsx

export type VarianteBouton = "primaire" | "secondaire" | "danger";

export interface BoutonProps {
  libelle: string;
  variante?: VarianteBouton;
  desactive?: boolean;
  onClick?: () => void;
}

const base =
  "px-4 py-2 rounded-lg font-medium transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-offset-1 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

// L'objet est indexé par l'union littérale : si vous ajoutez une variante
// à VarianteBouton sans l'ajouter ici, TypeScript le signale.
const variantes: Record<VarianteBouton, string> = {
  primaire: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
  secondaire: "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
};

export function Bouton({
  libelle,
  variante = "primaire",
  desactive = false,
  onClick,
}: BoutonProps) {
  return (
    <button
      type="button"
      disabled={desactive}
      onClick={onClick}
      className={`${base} ${variantes[variante]}`}
    >
      {libelle}
    </button>
  );
}
