# TP4 — Recherche de films en React + TypeScript

**Séance 4 · en binôme · rendu sur dépôt Git**

## Objectif

Reprendre le TP de recherche OMDB fait en JavaScript vanilla et le réécrire en React + TypeScript, avec les quatre états d'affichage et une requête annulable.

## L'écran à obtenir

![Aperçu du résultat attendu](apercu.png)

Un champ de recherche, et en dessous **un seul de ces quatre affichages à la fois** : l'invitation quand le champ est vide, « Chargement… » pendant la requête, le message d'erreur si elle échoue, ou la grille de résultats. Le cinquième cas — « aucun film ne correspond » — est celui qu'on oublie, et c'est le premier que voit un utilisateur qui tape n'importe quoi.

Les couleurs et les espacements sont libres. Ce qui compte, c'est que les quatre états soient **réellement atteignables** et que je puisse les provoquer devant vous.

## Point de départ

Votre projet du TP2 ou du TP3, avec ses composants `Bouton`, `Carte` et `Badge`.

## Ce qui vous est fourni

- `composants/` — les trois composants du TP2, dans leur version corrigée, si vous ne les avez pas.
- `env.local.exemple` — le fichier de configuration à renommer et à compléter.

## Consignes

**1. La clé d'API**

Créez un compte gratuit sur [omdbapi.com](https://www.omdbapi.com/apikey.aspx) : la clé arrive par email et le quota gratuit est de 1 000 requêtes par jour, largement suffisant.

Renommez `env.local.exemple` en **`.env.local`** à la racine du projet, à côté de `package.json`, et collez-y votre clé :

```
VITE_OMDB_KEY=votre_cle_ici
```

⚠️ **`.env.local`, pas `.env`.** Le `.gitignore` du template Vite ignore `*.local` — il n'ignore **pas** `.env`. Une clé placée dans `.env` part sur le dépôt au premier commit, et le rendu de ce TP est justement un dépôt Git.

Et sachez ce que ça protège exactement : toute variable préfixée `VITE_` est **inlinée dans le bundle au build**. `.env.local` empêche la clé de partir sur GitHub ; il ne l'empêche pas d'être lisible dans les outils de développement du navigateur. Pour une vraie application, la clé reste sur un serveur intermédiaire — c'est le point vu en cours.

Redémarrez `npm run dev` après avoir créé le fichier : Vite ne relit pas les variables d'environnement à chaud.

**2. `src/lib/omdb.ts` — les types et l'URL**

Faites une vraie recherche dans votre navigateur pour voir la forme exacte de la réponse :

```
https://www.omdbapi.com/?apikey=VOTRE_CLE&s=batman
```

Puis déclarez les deux interfaces d'après ce que vous voyez :

```ts
export interface FilmOmdb {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;      // "movie" | "series" | "game" — l'API n'est pas plus précise
  Poster: string;    // une URL, ou la chaîne "N/A"
}

export interface ReponseRecherche {
  Search?: FilmOmdb[];       // absent quand la recherche échoue
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}
```

**Pourquoi `FilmOmdb` et pas `Film` ?** Parce que `src/lib/utils.ts` exporte déjà un `Film` depuis le TP1. Deux types du même nom dans un même projet finissent toujours par être importés l'un pour l'autre.

Écrivez aussi la fonction qui construit l'URL — et **encodez le terme** (`encodeURIComponent`), sinon un espace ou un accent casse la requête.

Pour que `import.meta.env.VITE_OMDB_KEY` soit typé plutôt qu'`any`, complétez `src/vite-env.d.ts` :

```ts
interface ImportMetaEnv {
  readonly VITE_OMDB_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**3. La première version : `fetch` dans un `useEffect`**

Écrivez-la **à la main dans le composant**. Pas de hook personnalisé pour l'instant : le but est que vous écriviez une fois ce que vous factoriserez ensuite.

```ts
const [films, setFilms] = useState<FilmOmdb[]>([]);
const [chargement, setChargement] = useState(false);
const [erreur, setErreur] = useState<string | null>(null);
```

Trois pièges à traiter explicitement :

| Piège | Ce qu'il faut écrire |
|---|---|
| `fetch` ne rejette pas sur un 404 ou un 500 | `if (!r.ok) throw new Error(...)` |
| OMDB répond **200** avec `Response: "False"` | tester le contrat de l'API, pas seulement le code HTTP |
| en mode strict, le `catch` reçoit `unknown` | `e instanceof Error ? e.message : "Erreur inconnue"` |

Et rappelez-vous que la fonction passée à `useEffect` **ne peut pas être `async`** : on déclare la fonction asynchrone à l'intérieur, puis on l'appelle.

**4. Les quatre états**

Traitez-les dans cet ordre, par retours anticipés :

```
champ vide     → « Tapez un titre pour lancer la recherche. »
chargement     → « Chargement… »
erreur         → le message, en rouge
aucun résultat → « Aucun film ne correspond à « … ». »
sinon          → la grille
```

Anatomie :

```
RechercheFilms
│
├─ <input>  value={terme}  onChange={…}      ← champ contrôlé, comme au TP3
│
└─ un seul affichage à la fois
     ├─ !terme        → invitation
     ├─ chargement    → « Chargement… »
     ├─ erreur        → message rouge
     ├─ films vide    → « aucun film ne correspond »
     └─ sinon         → <ul> en grille
                          └─ <li key={film.imdbID}>
                               └─ CarteFilm  film={film}
```

**5. `AbortController`**

Ajoutez l'annulation de la requête précédente dans le nettoyage de l'effet :

```ts
const controleur = new AbortController();
// … fetch(url, { signal: controleur.signal })
return () => controleur.abort();
```

Deux raisons, et la deuxième est la vraie :

- en développement, `StrictMode` monte les composants deux fois : vous verrez **deux requêtes** dans l'onglet Réseau. C'est normal ;
- surtout, sans annulation, l'utilisateur tape « bat » puis « batman », la réponse de « bat » arrive en dernier et **écrase le bon résultat**.

L'`AbortError` qui remonte dans le `catch` n'est pas une erreur à afficher : c'est vous qui l'avez provoquée. Sortez du `catch` sans rien faire.

**6. `src/composants/CarteFilm.tsx`**

Un **adaptateur** : il traduit un film OMDB en props pour la `Carte` du TP2, qu'il ne modifie pas.

```ts
export interface CarteFilmProps {
  film: FilmOmdb;
}
```

Anatomie :

```
CarteFilm  film={film}
   │
   └─ Carte  titre     = film.Title
             sousTitre = film.Year
             children  = l'affiche + un Badge pour le type
                          ├─ Poster === "N/A" ? un bloc gris « Pas d'affiche »
                          └─ sinon : <img src={film.Poster} alt="Affiche de …" />
```

C'est le moment où le TP2 est rentabilisé : la `Carte` a été écrite sans rien savoir des films, donc elle accueille aussi bien un catalogue local qu'une réponse d'API. **Ne la modifiez pas** — si vous en avez envie, c'est que l'adaptateur n'est pas au bon endroit.

Le `Type` renvoyé par l'API vaut `movie`, `series` ou `game` : traduisez-le avec un objet indexé, comme les variantes du bouton au TP2.

**7. Bonus — le hook `useFetch<T>`**

Extrayez toute la logique de chargement dans `src/hooks/useFetch.ts` :

```ts
export function useFetch<T>(url: string | null): {
  donnees: T | null;
  chargement: boolean;
  erreur: string | null;
};
```

Deux points qui font tout l'intérêt de l'exercice :

- **`url: string | null`** — à `null`, le hook ne lance rien. C'est plus lisible qu'un `if` dans l'effet, et ça évite une dépendance instable.
- **le hook ne connaît pas OMDB.** Il gère le transport : HTTP, annulation, erreurs réseau. Le contrat métier de l'API (`Response === "False"`) reste la responsabilité du composant. Si le mot « film » apparaît dans `useFetch.ts`, c'est raté.

Comparez ensuite vos deux composants : même comportement, moitié moins de lignes. C'est l'argument.

**8. Bonus — la recherche différée (debounce)**

Ne lancez la requête que 400 ms après la dernière frappe. Tout tient dans un effet et son nettoyage :

```ts
useEffect(() => {
  const id = window.setTimeout(() => setTermeDiffere(terme), 400);
  return () => window.clearTimeout(id);
}, [terme]);
```

À chaque frappe, le nettoyage annule le minuteur précédent. C'est le même mécanisme que l'`AbortController`, appliqué au temps plutôt qu'au réseau.

## Points de vigilance

- **Pas de tableau de dépendances = boucle infinie.** L'effet modifie l'état, l'état déclenche un rendu, le rendu rejoue l'effet. Le réflexe de diagnostic : onglet **Réseau** des outils de développement — des requêtes qui défilent sans fin, c'est un tableau manquant ou instable.
- **Une dépendance doit être une valeur primitive.** Un objet ou un tableau se recrée à chaque rendu : passez `terme`, pas `{ terme }`.
- **`useEffect(async () => …)` ne compile pas.** Une fonction `async` renvoie une Promise, et React attend une fonction de nettoyage ou rien.
- **`r.json()` renvoie `any`.** L'annotation `const d: ReponseRecherche = await r.json()` est une promesse que vous faites au compilateur, pas une vérification. Si l'API change, TypeScript ne s'en apercevra pas.
- **`key={film.imdbID}`**, jamais l'index du tableau.
- **`Poster` peut valoir la chaîne `"N/A"`** : un `<img>` dessus affiche une icône cassée. Testez avant.
- **Redémarrez `npm run dev`** après avoir créé `.env.local`.

## Critères de réussite

- [ ] La clé d'API n'est pas commitée : `.env.local`, jamais dans le dépôt
- [ ] Les quatre états sont visibles et je peux les provoquer devant vous
- [ ] `CarteFilm` réutilise la `Carte` du TP2 **sans la modifier**
- [ ] Aucune boucle infinie : l'onglet Réseau est propre
- [ ] Le code d'erreur HTTP est vérifié (`r.ok`) avant de lire le corps
- [ ] Le nettoyage de l'effet est présent, et l'`AbortError` n'est pas affichée
- [ ] Le cas « pas d'affiche » est traité
- [ ] `npx tsc --noEmit` ne renvoie aucune erreur, et il n'y a aucun `any`
