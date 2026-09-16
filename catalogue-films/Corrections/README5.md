# TP5 — Une application multi-pages en React Router

**Séance 5 · en binôme · rendu sur dépôt Git**

## Objectif

Reprendre la recherche de films du TP4, qui tient dans un seul écran, et en faire une vraie application : plusieurs pages, une URL par page, une zone réservée aux utilisateurs connectés, et une liste de favoris accessible depuis n'importe où.

## Ce que ça doit donner

Un en-tête toujours visible, avec les liens du menu et un compteur de favoris, et en dessous la page courante :

| URL | Page | Contenu |
|---|---|---|
| `/` | Accueil | Un titre, deux phrases, un lien vers la recherche |
| `/recherche` | Recherche | Le composant du TP4, inchangé ou presque |
| `/films/:id` | Détail | Un film chargé depuis son `imdbID`, avec un bouton « Ajouter aux favoris » |
| `/favoris` | Favoris | La liste des films mis de côté — **accessible seulement une fois connecté** |
| `/connexion` | Connexion | Un champ pseudo, un bouton |
| n'importe quoi d'autre | 404 | « Cette page n'existe pas. » |

Le style est libre, celui du TP4 suffit. Ce qui est évalué, c'est le comportement : la navigation ne recharge jamais la page, l'en-tête n'est écrit qu'une fois, et `/favoris` tapé directement dans la barre d'adresse renvoie vers `/connexion`.

## Point de départ

Votre projet du TP4, avec sa clé OMDB dans `.env.local`.

Une seule installation :

```
npm install react-router-dom
```

## Ce qui vous est fourni

- `composants/` — `Bouton`, `Carte`, `Badge` et `CarteFilm` dans leur version corrigée du TP4.
- `hooks/useFetch.ts` — le hook générique, qui était un **bonus** au TP4. Vous en avez besoin ici : prenez-le si vous ne l'avez pas écrit.
- `lib/omdb.ts` — la version du TP4 **augmentée** : le type `FilmDetailOmdb` et la fonction `urlDetail`, pour la page de détail.
- `env.local.exemple` — si vous repartez d'un projet neuf.

## Consignes

**1. Brancher le routeur et poser le layout**

`BrowserRouter` n'apparaît qu'à un seul endroit de l'application, dans `main.tsx` :

```tsx
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

Créez `src/composants/Layout.tsx` : l'en-tête, `<Outlet />` au milieu, un pied de page. Puis déclarez les routes dans `App.tsx`, en **routes imbriquées** — c'est ce qui fait que le menu n'est écrit qu'une fois :

```tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Accueil />} />
    <Route path="recherche" element={<Recherche />} />
    <Route path="films/:id" element={<DetailFilm />} />
    <Route path="connexion" element={<Connexion />} />
    <Route path="*" element={<PageIntrouvable />} />
  </Route>
</Routes>
```

Les chemins enfants sont **relatifs** : `recherche`, pas `/recherche`. Le menu utilise `NavLink` pour marquer la page active :

```tsx
<NavLink
  to="/recherche"
  className={({ isActive }) => (isActive ? "font-bold text-blue-600" : "text-slate-600")}
>
  Recherche
</NavLink>
```

Rangez les pages dans `src/pages/`. Chaque page est un composant ordinaire : aucune ne sait qu'elle est routée.

**2. La page de détail**

L'identifiant vient de l'URL, et `useParams` le renvoie toujours comme `string | undefined` :

```tsx
const { id } = useParams();
const { donnees, chargement, erreur } = useFetch<FilmDetailOmdb>(id ? urlDetail(id) : null);
```

C'est exactement à ça que sert le `url: string | null` du hook : pas d'identifiant, pas de requête, et pas de `if` dans l'effet.

Traitez les mêmes états qu'au TP4 — chargement, erreur, film introuvable (`Response === "False"`), affichage — et affichez au moins le titre, l'année, le genre, la durée et le synopsis.

Pour y arriver depuis la recherche, rendez chaque carte cliquable. **`CarteFilm` ne bouge pas** : c'est la liste qui enveloppe la carte dans un `Link`.

```tsx
<li key={film.imdbID}>
  <Link to={`/films/${film.imdbID}`}>
    <CarteFilm film={film} />
  </Link>
</li>
```

**3. `AuthContext` — une connexion simulée**

Dans `src/contextes/AuthContext.tsx`, le patron en quatre étapes vu en cours. On écrit le contrat d'abord :

```tsx
interface AuthContexte {
  pseudo: string | null;
  connecter: (pseudo: string) => void;
  deconnecter: () => void;
}
```

Le contexte est créé à `undefined`, le `Provider` détient l'état avec un `useState`, et le hook de consommation **refuse** de renvoyer `undefined` :

```tsx
export function useAuth(): AuthContexte {
  const contexte = useContext(Contexte);
  if (contexte === undefined) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>");
  }
  return contexte;
}
```

Sans cette garde, un composant placé hors du Provider plante dix lignes plus loin avec un message incompréhensible. C'est la garde qu'on lit dans le message d'erreur, pas le plantage.

La page `/connexion` : un champ contrôlé comme au TP3, un `Bouton`, et `connecter(pseudo)` à la validation. Aucun mot de passe, aucun serveur — un pseudo non vide suffit.

L'en-tête affiche « Connecté en tant que *pseudo* » et un bouton Déconnexion, ou un lien vers `/connexion`.

**4. Protéger `/favoris`**

Un composant, une seule responsabilité :

```tsx
function RouteProtegee({ children }: { children: ReactNode }) {
  const { pseudo } = useAuth();
  if (!pseudo) return <Navigate to="/connexion" replace />;
  return <>{children}</>;
}
```

Puis, dans les routes :

```tsx
<Route path="favoris" element={<RouteProtegee><Favoris /></RouteProtegee>} />
```

`replace` évite d'empiler la page protégée dans l'historique : sans lui, le bouton Précédent renvoie l'utilisateur sur la redirection, en boucle.

Et retenez le vrai statut de ce code : une route protégée côté client cache un affichage, elle ne protège rien. La donnée arrive du serveur, c'est lui qui autorise.

**5. Les favoris avec `useReducer`**

Le contexte des favoris est le deuxième que vous écrivez — le patron est le même. La différence, c'est que l'état est piloté par un reducer et non par un `useState`.

Dans `src/contextes/FavorisContext.tsx` :

```ts
type ActionFavoris =
  | { type: "ajouter"; film: FilmOmdb }
  | { type: "retirer"; id: string }
  | { type: "vider" };

function reducerFavoris(etat: FilmOmdb[], action: ActionFavoris): FilmOmdb[] {
  switch (action.type) {
    // à vous
  }
}
```

Trois règles s'appliquent, et elles se vérifient en lisant le code :

- le reducer est une **fonction pure** : pas de `fetch`, pas de `Date`, pas de `localStorage` ;
- il **renvoie un nouveau tableau** — `[...etat, action.film]`, `etat.filter(...)` — il ne pousse jamais dans l'ancien ;
- `"ajouter"` doit **refuser un doublon**. Un utilisateur qui clique deux fois sur le même film est le cas normal, pas le cas tordu.

Exposez l'état et `dispatch` par le Provider, et écrivez le hook gardé `useFavoris`. Ensuite : le compteur de l'en-tête, le bouton « Ajouter aux favoris » de la page de détail, et le bouton « Retirer » de la page Favoris lisent tous le même contexte, sans qu'aucune prop ne traverse le `Layout`. C'est le prop drilling de la slide 16 qui disparaît pour de bon.

Branchez les deux Providers dans `main.tsx` :

```tsx
<AuthProvider>
  <FavorisProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </FavorisProvider>
</AuthProvider>
```

**6. Bonus — le mode sombre**

Un troisième contexte, écrit sans réfléchir : `theme` valant `"clair"` ou `"sombre"`, une fonction `basculer`, un bouton dans l'en-tête. Puis un effet qui pose la classe sur `<html>` et retient le choix :

```ts
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "sombre");
  localStorage.setItem("theme", theme);
}, [theme]);
```

Lisez la valeur de départ dans `localStorage` à l'initialisation du `useState`, et vos classes `dark:` de la séance 2 s'allument toutes d'un coup.

**7. Bonus — revenir là où on allait**

Un utilisateur qui demande `/favoris` sans être connecté est renvoyé vers `/connexion`, puis atterrit sur l'accueil : il a perdu sa page. Mémorisez l'emplacement demandé dans la redirection :

```tsx
const emplacement = useLocation();
return <Navigate to="/connexion" state={{ de: emplacement }} replace />;
```

et, après connexion, `naviguer(de, { replace: true })` avec `useNavigate`.

**8. Bonus — des favoris qui survivent au rafraîchissement**

`localStorage` ne stocke que des chaînes : `JSON.stringify` pour écrire, `JSON.parse` pour relire. La lecture se fait à l'initialisation du `useReducer` (son troisième argument, ou une fonction passée comme état initial), l'écriture dans un effet qui dépend de l'état. **Pas dans le reducer** : ce serait un effet de bord dans une fonction pure.

## Points de vigilance

- **`<a href="/favoris">` recharge toute la page** et vide vos trois contextes. Pour un lien interne, c'est `Link` ou `NavLink`, toujours. `<a href>` reste correct pour un lien externe.
- **`useParams` renvoie `string | undefined`**, même quand la route garantit le paramètre. Testez avant d'en faire une URL.
- **Un chemin enfant ne commence pas par `/`.** `path="/recherche"` dans une route imbriquée, et plus rien ne s'affiche.
- **Hors du Provider, un hook de contexte renvoie `undefined`.** Si votre garde se déclenche, ce n'est pas elle qui a tort : c'est qu'un composant est monté au-dessus du Provider.
- **Un reducer qui mute son état ne provoque pas de rendu.** `etat.push(film); return etat;` renvoie la même référence, React ne voit rien changer, et l'écran reste figé. Le bug est silencieux, c'est le pire.
- **Le `switch` doit traiter tous les cas.** Avec une union discriminée, en oublier un est une erreur de compilation — à condition de ne pas ajouter de `default` qui masque tout.
- **Ne modifiez ni `Carte`, ni `CarteFilm`.** Si vous en ressentez le besoin, c'est que ce que vous voulez ajouter est au mauvais endroit.
- **`npx tsc --noEmit`** avant de pousser, comme d'habitude.

## Critères de réussite

- [ ] La navigation ne recharge jamais la page : l'onglet Réseau ne montre aucune requête de document
- [ ] L'en-tête et le pied de page ne sont écrits qu'une fois, dans le `Layout`, avec `<Outlet />`
- [ ] `NavLink` marque la page active dans le menu
- [ ] Une URL inconnue affiche la page 404, et pas un écran blanc
- [ ] `/films/:id` charge le bon film, et `useFetch` n'est pas appelé sans identifiant
- [ ] `/favoris` tapé directement dans la barre d'adresse redirige vers `/connexion`
- [ ] Le hook de consommation de chaque contexte lève une erreur hors de son Provider
- [ ] Les actions du reducer sont une union discriminée, et le `switch` est exhaustif
- [ ] Le reducer ne mute rien et refuse les doublons
- [ ] Le compteur de favoris de l'en-tête se met à jour depuis la page de détail, sans aucune prop traversante
- [ ] `npx tsc --noEmit` ne renvoie aucune erreur, et il n'y a aucun `any`
