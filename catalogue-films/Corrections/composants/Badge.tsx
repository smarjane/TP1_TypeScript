// src/composants/Badge.tsx

export type TonBadge = "neutre" | "succes" | "info" | "attention";

export interface BadgeProps {
  texte: string;
  ton?: TonBadge;
}

const tons: Record<TonBadge, string> = {
  neutre: "bg-slate-100 text-slate-700",
  succes: "bg-green-100 text-green-800",
  info: "bg-blue-100 text-blue-800",
  attention: "bg-amber-100 text-amber-800",
};

export function Badge({ texte, ton = "neutre" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${tons[ton]}`}
    >
      {texte}
    </span>
  );
}
