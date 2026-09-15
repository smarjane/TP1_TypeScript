import type { ChangeEvent } from "react";

export interface ChampTexteProps {
  nom: string;
  label: string;
  valeur: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password";
  erreur?: string;
  placeholder?: string;
}

export default function ChampTexte({
  nom,
  label,
  valeur,
  onChange,
  type = "text",
  erreur,
  placeholder,
}: ChampTexteProps) {
  const id = nom;
  const erreurId = erreur ? `${nom}-erreur` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        id={id}
        name={nom}
        type={type}
        value={valeur}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(erreur)}
        aria-describedby={erreurId}
        className={[
          "w-full rounded-lg border bg-white px-3 py-2 text-slate-800 outline-none transition",
          erreur ? "border-red-500" : "border-slate-300",
          "focus:ring-2 focus:ring-blue-200",
        ].join(" ")}
      />

      {erreur ? (
        <p id={erreurId} className="text-sm text-red-600">
          {erreur}
        </p>
      ) : null}
    </div>
  );
}
