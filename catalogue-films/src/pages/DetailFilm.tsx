import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { urlDetail } from "../lib/omdb";
import type { FilmDetailOmdb } from "../lib/omdb";

export default function DetailFilm() {
  const { id } = useParams();
  const { donnees, chargement, erreur } = useFetch<FilmDetailOmdb>(
    id ? urlDetail(id) : null
  );

  if (chargement) return <p>Chargement…</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;
  if (!donnees) return <p>Aucun résultat.</p>;
  if (donnees.Response === "False") return <p>Film introuvable.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{donnees.Title}</h2>
      <p><strong>Année :</strong> {donnees.Year}</p>
      <p><strong>Genre :</strong> {donnees.Genre}</p>
      <p><strong>Durée :</strong> {donnees.Runtime}</p>
      <p><strong>Synopis :</strong> {donnees.Plot}</p>
    </div>
  );
}
