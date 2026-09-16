// src/composants/Carte.tsx
import type { ReactNode } from "react";

export interface CarteProps {
  titre: string;
  sousTitre?: string;
  children: ReactNode;   // le contenu libre de la carte
  actions?: ReactNode;   // emplacement optionnel pour des boutons
}

export function Carte({ titre, sousTitre, children, actions }: CarteProps) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg bg-white p-4 shadow-sm">
      <header>
        <h3 className="text-lg font-bold text-slate-900">{titre}</h3>
        {sousTitre && <p className="text-sm text-slate-500">{sousTitre}</p>}
      </header>

      <div className="flex-1 text-sm text-slate-700">{children}</div>

      {actions && <footer className="flex gap-2 pt-1">{actions}</footer>}
    </article>
  );
}
