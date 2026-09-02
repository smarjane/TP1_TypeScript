# TP1 — Du JavaScript au TypeScript strict

**Séance 1 · en binôme · rendu sur dépôt Git**

## Objectif

Reprendre un module JavaScript existant, le migrer en TypeScript strict, et l'intégrer dans un projet Vite + React fraîchement créé.

## Ce qui vous est fourni

- `utils.js` — un catalogue de films qui fonctionne parfaitement en JavaScript. C'est votre point de départ.

## Consignes

1. Créer un projet Vite avec le template `react-ts` et vérifier que `npm run dev` démarre.

   ```bash
   npm create vite@latest catalogue-films -- --template react-ts
   cd catalogue-films && npm install && npm run dev
   ```

2. Copier `utils.js` dans `src/lib/` et le renommer en `utils.ts`.
3. Corriger les erreurs **une par une** jusqu'à ce que `npx tsc --noEmit` ne renvoie plus rien.
4. Déclarer une interface `Film` décrivant les champs `id`, `titre`, `annee`, `genres` et `note`.
5. Écrire une fonction générique `trierPar<T>(liste: T[], cle: keyof T): T[]`.
6. Ajouter un type union `StatutFilm` et une fonction utilisant le narrowing.
7. Afficher trois films typés dans `App.tsx` (mise en forme libre).
8. Produire un build avec `npm run build` et vérifier le contenu de `dist/`.

## Comment procéder

Les erreurs arrivent **en deux vagues**. C'est normal, et c'est le cœur de l'exercice.

**Première vague — 26 erreurs.** Presque toutes du même type : `TS7006: Parameter implicitly has an 'any' type`. Le mode strict refuse les paramètres non annotés. Commencez par là.

**Deuxième vague.** Dès que les paramètres sont typés, le compilateur voit enfin ce que fait votre code, et de nouvelles erreurs apparaissent — plus intéressantes :

| Code | Ce que ça veut dire | Où ça se joue |
|---|---|---|
| `TS2532` | Object is possibly 'undefined' | bloc 3 — `find()` peut ne rien trouver |
| `TS7053` | Can't be used to index type 'Film' | bloc 4 — c'est `keyof T` qui manque |
| `TS2345` | 'undefined' is not assignable | bloc 5 — le paramètre optionnel n'est pas vérifié |
| `TS2322` | Type 'string' is not assignable to 'number' | bloc 2 — la fonction renvoie deux types |

Ne cherchez pas à tout corriger d'un coup. Relancez `npx tsc --noEmit` après chaque bloc : voir le compteur d'erreurs descendre est la meilleure façon d'avancer.

## Les dix blocs du fichier

Chaque bloc numéroté dans `utils.js` cache un problème différent :

1. Paramètres non typés
2. Un retour de type variable → type union + narrowing chez l'appelant
3. Une recherche qui peut échouer → `Film | undefined` et garde explicite
4. Un tri générique → `<T>` et `keyof T`
5. Un paramètre optionnel jamais vérifié
6. Un statut libre → union littérale `StatutFilm`
7. Une valeur venue de l'extérieur → `localStorage.getItem` renvoie `string | null`
8. Une mise à jour partielle → `Partial<Omit<Film, "id">>`
9. Une création sans identifiant → `Omit<Film, "id">`
10. Une mutation silencieuse → `readonly` et retour d'un nouvel objet

## Critères de réussite

- [ ] `npx tsc --noEmit` ne renvoie aucune erreur
- [ ] `strict` est resté à `true` dans `tsconfig.json`
- [ ] Aucun `any` dans le code rendu — ni implicite, ni explicite
- [ ] Au moins un type utilitaire est utilisé (`Partial`, `Pick` ou `Omit`)
- [ ] La fonction générique est contrainte, et non typée en `any`
- [ ] Le build se termine sans erreur

## Pour aller plus loin

- Ajouter un `default: { const jamais: never = film.statut; }` dans `libelleStatut` : le compilateur vous préviendra si un statut est ajouté sans être traité.
- Marquer `id` en `readonly` et constater ce que ça interdit.
- Remplacer `JSON.parse(brut) as number[]` par une vraie validation. Question ouverte : pourquoi le `as` n'est-il pas une garantie ?
