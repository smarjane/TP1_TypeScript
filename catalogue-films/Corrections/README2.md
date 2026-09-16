# TP2 — Un mini design system typé

**Séance 2 · en binôme · rendu sur dépôt Git**

## Objectif

Reprendre le projet du TP1 et le transformer en une véritable interface : trois composants réutilisables et typés, une liste de films affichée en grille responsive, le tout mis en forme avec Tailwind CSS.

## L'écran à obtenir

![Aperçu du résultat attendu](apercu.png)

Quatre composants seulement, réutilisés partout : une **Carte** par film, des **Badges** pour le statut et les genres, un **Bouton** dans le pied de chaque carte, le tout assemblé par **ListeFilms**. La zone grise en bas est ce que `ListeFilms` affiche quand la liste est vide.

Les couleurs et les espacements exacts sont libres — c'est la structure qui compte.

## Point de départ

Votre projet du TP1, avec `src/lib/utils.ts` : l'interface `Film`, le type `StatutFilm`, les fonctions `trierPar`, `filtrerParGenre` et la constante `FILMS`.

## Ce qui vous est fourni

- `utils.ts` — une version **simplifiée** du module du TP1, réduite à ce dont le TP2 a besoin.

> **Vous avez terminé le TP1 ?** Gardez votre fichier : il fait déjà tout cela, et davantage.
>
> **Vous n'avez pas terminé ?** Placez ce `utils.ts` dans `src/lib/` et démarrez avec. Ce n'est pas le corrigé du TP1 : il ne contient ni les types utilitaires, ni le contrôle d'exhaustivité, ni les fonctions que vous deviez écrire. Vous êtes débloqués pour aujourd'hui, mais le TP1 reste à finir.

## Consignes

**1. Ajouter Tailwind CSS au projet**

```bash
npm install tailwindcss @tailwindcss/vite
```

Ajouter le plugin dans `vite.config.ts`, puis remplacer le contenu de `src/index.css` par `@import "tailwindcss";`. Vérifier qu'une classe s'applique avant d'aller plus loin — par exemple `className="text-red-500"` sur un titre.

**2. `src/composants/Bouton.tsx`**

Le contrat à respecter :

```ts
export type VarianteBouton = "primaire" | "secondaire" | "danger";

export interface BoutonProps {
  libelle: string;
  variante?: VarianteBouton;   // "primaire" par défaut
  desactive?: boolean;         // false par défaut
  onClick?: () => void;
}
```

Il doit afficher un `<button>` contenant `libelle`, désactivé quand `desactive` vaut `true`, et dont les classes Tailwind changent selon la variante.

Les classes de chaque variante sont rangées dans un objet `Record<VarianteBouton, string>` — pas dans une suite de `if`. Le choix des couleurs est libre, tant que les trois variantes se distinguent et que le focus reste visible au clavier.

```tsx
<Bouton libelle="Valider" />
<Bouton libelle="Supprimer" variante="danger" onClick={supprimer} />
<Bouton libelle="Indisponible" desactive />
```


Anatomie :

```
┌──────────────────────────┐
│      libelle             │  ← le texte reçu en prop
└──────────────────────────┘
   ↑ fond, texte et survol donnés par « variante »
     opacité réduite et curseur barré si « desactive »
```

**3. `src/composants/Carte.tsx`**

```ts
export interface CarteProps {
  titre: string;
  sousTitre?: string;
  children: ReactNode;
  actions?: ReactNode;   // pied de carte, optionnel
}
```

Il doit afficher un bloc sur fond blanc, avec coins arrondis et ombre légère, contenant dans l'ordre :

1. le `titre`, en gras ;
2. le `sousTitre` en dessous, plus petit et plus clair — **uniquement s'il est fourni** ;
3. le contenu `children`, quel qu'il soit ;
4. `actions` en pied de carte — **uniquement si fourni**.

La carte ne décide jamais de son contenu : elle l'accueille.

```tsx
<Carte titre="Alien" sousTitre="1979 — 8.5/10" actions={<Bouton libelle="Détails" />}>
  <p>Un équipage découvre un signal…</p>
</Carte>
```


Anatomie :

```
┌───────────────────────────────────┐
│ titre                             │  ← gras
│ sousTitre                         │  ← plus petit et plus clair, si fourni
│                                   │
│ children                          │  ← contenu libre, décidé par l'appelant
│                                   │
│ actions                           │  ← pied de carte, si fourni
└───────────────────────────────────┘
   fond blanc · coins arrondis · ombre légère
```

**4. `src/composants/Badge.tsx`**

```ts
export type TonBadge = "neutre" | "succes" | "info" | "attention";

export interface BadgeProps {
  texte: string;
  ton?: TonBadge;   // "neutre" par défaut
}
```

Il doit afficher un petit `<span>` arrondi, en texte réduit, avec une couleur de fond par ton. Même principe que le bouton : un objet indexé par l'union.

```tsx
<Badge texte="SF" />
<Badge texte="Déjà vu" ton="succes" />
```


Anatomie :

```
╭───────────╮
│  texte    │   ← petite pastille arrondie
╰───────────╯
   couleur de fond donnée par « ton »
```

**5. `src/composants/ListeFilms.tsx`**

```ts
export interface ListeFilmsProps {
  films: Film[];
  messageVide?: string;
  onSelection?: (film: Film) => void;
}
```

C'est le composant qui assemble les trois autres. Il doit afficher une `<ul>` en grille, avec une `<li>` par film portant sa `key`, et dans chaque `<li>` une `Carte` où :

- le titre de la carte est le titre du film ;
- le sous-titre est l'année et la note, par exemple `1979 — 8.5/10` ;
- le contenu est un `Badge` pour le statut, suivi d'un `Badge` par genre ;
- si `onSelection` est fourni, un `Bouton` « Détails » est placé dans `actions`.

Pour le badge de statut, utilisez cette correspondance — elle vous évitera d'inventer :

| statut | libellé affiché | ton |
|---|---|---|
| `vu` | Déjà vu | `succes` |
| `a_voir` | À voir | `info` |
| `abandonne` | Abandonné | `neutre` |

Rangez-la, elle aussi, dans un objet indexé par `StatutFilm`.


Anatomie :

```
ListeFilms
│
├─ films vide ?  →  message unique, et on s'arrête là
│
└─ sinon : <ul> en grille
     └─ <li key={film.id}>
          └─ Carte  titre = film.titre
                    sousTitre = "1979 — 8.5/10"
                    children  = Badge(statut) + un Badge par genre
                    actions   = Bouton « Détails »  (si onSelection)
```

**6. Traiter le cas de la liste vide**

Si le tableau reçu est vide, afficher un message dédié plutôt qu'une grille vide. Traitez ce cas **en premier**, par un retour anticipé.

**7. Assembler dans `App.tsx`**

Réutilisez `trierPar` et `filtrerParGenre` du TP1 pour afficher plusieurs sections : tous les films triés par titre, puis un genre en particulier. Prévoyez une section dont le filtre ne renvoie rien, pour démontrer le cas vide.

**8. Grille responsive**

1 colonne sur mobile, 2 à partir de `md`, 4 à partir de `lg`. Aucune feuille de style personnalisée : tout passe par des classes Tailwind.

## Ce que vous ne devez pas encore utiliser

Pas de `useState`, pas de `useEffect` : ils arrivent en séance 3 et 4. Cette interface est entièrement statique, et c'est volontaire — tout ce qui s'affiche découle des données et des props.

## Points de vigilance

- **`variante = "primaire"` en valeur par défaut**, plutôt que `variante?: string`. L'éditeur proposera alors les trois valeurs possibles, et refusera les fautes de frappe.
- **`Record<VarianteBouton, string>`** pour la table des styles : si vous ajoutez une variante à l'union sans l'ajouter à la table, le compilateur vous le dit.
- **`{films.length === 0 ? … }`** ou un retour anticipé, jamais `{films.length && …}` : avec un tableau vide, le `0` s'afficherait à l'écran.
- **`import type { ReactNode } from "react"`** : le mot-clé `type` indique qu'on n'importe qu'un type, effacé au build.
- **Les classes Tailwind sont mobile-first** : le style sans préfixe s'applique partout, `md:` et `lg:` ajoutent les adaptations pour les écrans plus larges.

## Critères de réussite

- [ ] Chaque composant exporte son interface de props
- [ ] `npx tsc --noEmit` ne renvoie aucune erreur, et il n'y a aucun `any`
- [ ] `Carte` accepte du contenu libre via `children`
- [ ] La variante du bouton est une union littérale, pas une chaîne libre
- [ ] Les `key` sont des identifiants stables, pas des index
- [ ] Le cas de la liste vide est traité avec un message dédié
- [ ] La grille s'adapte réellement à trois largeurs d'écran
- [ ] Les états `hover` et `focus` sont visibles, y compris au clavier
- [ ] Aucune feuille CSS personnalisée
