import { useLocation, useNavigate, useParams } from "react-router-dom";
import Bouton from "../composants/Bouton";
import { useAuth } from "../contextes/useAuth";
import { useFavoris } from "../contextes/useFavoris";
import { useFetch } from "../hooks/useFetch";
import { urlDetail } from "../lib/omdb";
import type { FilmDetailOmdb } from "../lib/omdb";

export default function DetailFilm() {
  const { id } = useParams();
  const emplacement = useLocation();
  const navigate = useNavigate();
  const { pseudo } = useAuth();
  const { favoris, ajouter, retirer } = useFavoris();
  const { donnees, chargement, erreur } = useFetch<FilmDetailOmdb>(
    id ? urlDetail(id) : null
  );

  if (chargement) return <p>Chargement…</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;
  if (!donnees) return <p>Aucun résultat.</p>;
  if (donnees.Response === "False") return <p>Film introuvable.</p>;

  const estFavori = favoris.some((film) => film.imdbID === donnees.imdbID);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{donnees.Title}</h2>
      <p><strong>Année :</strong> {donnees.Year}</p>
      <p><strong>Genre :</strong> {donnees.Genre}</p>
      <p><strong>Durée :</strong> {donnees.Runtime}</p>
      <p><strong>Synopsis :</strong> {donnees.Plot}</p>
      <Bouton
        libelle={estFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
        onClick={() => {
          if (estFavori) {
            retirer(donnees.imdbID);
            return;
          }

          if (!pseudo) {
            navigate("/connexion", { state: { de: emplacement }, replace: true });
            return;
          }

          ajouter(donnees);
        }}
      />
    </div>
  );
}
