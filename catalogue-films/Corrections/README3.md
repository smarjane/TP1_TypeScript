# TP3 — Formulaire d'inscription validé

**Séance 3 · en binôme · rendu sur dépôt Git**

## Objectif

Construire un formulaire contrôlé entièrement typé, avec validation à la soumission, affichage d'erreurs accessible, et un récapitulatif des inscriptions affiché en dessous.

## L'écran à obtenir

![Aperçu du résultat attendu](apercu.png)

À gauche, le formulaire tel qu'il se présente **après une soumission invalide** : chaque champ fautif porte une bordure rouge et son message juste en dessous. À droite, la liste des inscriptions déjà validées, une `Carte` par inscrit — et ce qu'affiche cette liste quand elle est vide.

Les couleurs et les espacements exacts sont libres — c'est le comportement qui compte.

## Point de départ

Votre projet du TP2, avec ses composants `Bouton`, `Carte` et `Badge`.

## Ce qui vous est fourni

- `composants/` — les trois composants du TP2, dans leur version corrigée.

> **Vous avez terminé le TP2 ?** Gardez vos composants, ils font l'affaire.
>
> **Vous n'avez pas terminé ?** Copiez ceux-ci dans `src/composants/` et démarrez avec. Ils ne dispensent pas de finir le TP2.

Rien d'autre n'est fourni : le formulaire, la validation et la liste sont entièrement à écrire.

## Consignes

**1. Rendre `Bouton` capable de soumettre**

Le `Bouton` du TP2 est figé en `type="button"` : cliqué dans un formulaire, il ne déclenche rien. Ajoutez-lui une prop `type`, typée par une union — pas par `string` :

```ts
export type TypeBouton = "button" | "submit";
// dans BoutonProps :
type?: TypeBouton;   // "button" par défaut
```

C'est la seule modification à apporter aux composants du TP2. `Carte` et `Badge` sont réutilisés tels quels.

**2. `src/lib/inscription.ts` — les types et la validation**

Ce fichier ne contient aucun JSX. Il décrit les données du formulaire et les règles qui s'y appliquent :

```ts
export interface Inscription {
  prenom: string;
  email: string;
  motDePasse: string;
  confirmation: string;
  cgv: boolean;
}

export const valeursInitiales: Inscription = { /* tous les champs vides */ };

export type Erreurs = Partial<Record<keyof Inscription, string>>;

export function valider(donnees: Inscription): Erreurs { /* … */ }
```

`Erreurs` doit être **dérivé** de `Inscription` par `keyof`, jamais réécrit à la main. Ainsi, si vous ajoutez un champ demain, le type des erreurs le connaît immédiatement, et une faute de frappe (`erreurs.emial`) devient une erreur de compilation.

Les règles à implémenter :

| Champ | Règle |
|---|---|
| `prenom` | au moins 2 caractères, espaces de bord ignorés |
| `email` | format `xxx@yyy.zz` |
| `motDePasse` | 8 caractères minimum |
| `confirmation` | identique à `motDePasse` |
| `cgv` | doit valoir `true` |

`valider` renvoie un objet **vide** quand tout est correct. C'est ce qui permet d'écrire `Object.keys(erreurs).length === 0` pour décider si on continue.

**3. `src/composants/ChampTexte.tsx` — un champ contrôlé réutilisable**

Le contrat :

```ts
export interface ChampTexteProps {
  nom: string;                                     // sert d'id ET de name
  label: string;
  valeur: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password";            // "text" par défaut
  erreur?: string;
  placeholder?: string;
}
```

Sans ce composant, les lignes d'accessibilité seraient à recopier quatre fois. Il regroupe le label, le champ et le message d'erreur.

Anatomie :

```
┌───────────────────────────────────────────┐
│ label                                     │  ← <label htmlFor={nom}>
│ ┌───────────────────────────────────────┐ │
│ │ valeur                                │ │  ← <input id={nom} name={nom}
│ └───────────────────────────────────────┘ │       value={valeur} onChange={…} />
│ erreur                                    │  ← <p id={nom + "-erreur"}>, si fourni
└───────────────────────────────────────────┘
   bordure rouge si « erreur », grise sinon
   aria-invalid={!!erreur}
   aria-describedby = l'id du <p>, ou undefined s'il n'y a pas d'erreur
```

**4. `src/composants/FormulaireInscription.tsx`**

C'est le composant qui porte l'état. Trois `useState` seulement :

```ts
const [donnees, setDonnees] = useState<Inscription>(valeursInitiales);
const [erreurs, setErreurs] = useState<Erreurs>({});
const [envoiEnCours, setEnvoiEnCours] = useState(false);
```

Un **seul** objet pour les cinq champs, donc un **seul** handler de saisie, qui s'appuie sur l'attribut `name` :

```ts
const gererSaisie = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setDonnees((d) => ({ ...d, [name]: value }));   // clé dynamique
};
```

⚠️ **La case à cocher est le piège de ce TP.** Un `<input type="checkbox">` ne transporte pas sa donnée dans `value` mais dans `checked`. Votre handler doit distinguer les deux :

```ts
const { name, value, type, checked } = e.target;
const valeur = type === "checkbox" ? checked : value;
```

Et côté JSX, une case cochée se pilote par `checked={donnees.cgv}`, jamais par `value`.

La soumission se branche sur le `<form>`, pas sur le bouton :

```ts
const gererEnvoi = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const trouvees = valider(donnees);
  setErreurs(trouvees);
  if (Object.keys(trouvees).length > 0) return;
  // … c'est valide : on prévient le parent, on remet le formulaire à zéro
};
```

Le formulaire **ne stocke pas** la liste des inscriptions : il reçoit une prop `onInscription: (donnees: Inscription) => void` et l'appelle. Qui détient l'état détient la vérité — et ici, c'est `App`.

Ajoutez `noValidate` sur le `<form>` : sans cela, le navigateur affiche ses propres bulles de validation par-dessus les vôtres.

**5. L'état de soumission**

Pendant l'envoi, le bouton est désactivé et son libellé change en « Envoi en cours… ». Il n'y a pas encore de serveur : simulez le délai avec un `window.setTimeout` de quelques centaines de millisecondes, puis remettez `envoiEnCours` à `false`. Le vrai appel réseau arrive en séance 4.

**6. `src/composants/ListeInscriptions.tsx`**

```ts
export interface ListeInscriptionsProps {
  inscriptions: InscriptionEnregistree[];
  onSuppression?: (id: number) => void;
}
```

Une `Carte` par inscrit : le prénom en titre, l'email en sous-titre, un `Badge` dans le contenu, et un `Bouton` « Supprimer » dans `actions` si `onSuppression` est fourni. Cas vide traité **en premier**, par un retour anticipé, comme au TP2.

Anatomie :

```
ListeInscriptions
│
├─ liste vide ?  →  message unique, et on s'arrête là
│
└─ sinon : <ul> en grille
     └─ <li key={inscription.id}>
          └─ Carte  titre     = prenom
                    sousTitre = email
                    children  = Badge « CGV acceptées »
                    actions   = Bouton « Supprimer »  (si onSuppression)
```

**7. `src/App.tsx` — assembler**

`App` détient la liste :

```ts
const [inscriptions, setInscriptions] = useState<InscriptionEnregistree[]>([]);
```

Le type stocké n'est **pas** `Inscription` : on ne conserve jamais un mot de passe. Dérivez-le du type existant plutôt que d'en réécrire un :

```ts
export type InscriptionEnregistree =
  Omit<Inscription, "motDePasse" | "confirmation"> & { id: number };
```

Ajout et suppression se font **sans muter** :

```ts
setInscriptions((liste) => [nouvelle, ...liste]);              // ajout
setInscriptions((liste) => liste.filter((i) => i.id !== id));  // suppression
```

## Ce que vous ne devez pas encore utiliser

Pas de `useEffect`, pas de `fetch`, pas de bibliothèque de formulaires (React Hook Form, Formik, Zod…). Tout s'écrit à la main : c'est la seule façon de comprendre ce que ces bibliothèques font à votre place.

## Points de vigilance

- **`useState([])` donne `never[]`** : dès que la valeur initiale est `[]`, `null` ou `undefined`, il faut annoter — `useState<InscriptionEnregistree[]>([])`.
- **Jamais de mutation** : ni `push`, ni `inscriptions[0].prenom = …`. React compare les références : muter le tableau existant ne déclenche aucun rendu.
- **Mise à jour fonctionnelle** dès que le nouvel état dépend du précédent : `setDonnees((d) => ({ ...d, … }))`, pas `setDonnees({ ...donnees, … })`.
- **`onSubmit` sur le `<form>`**, jamais `onClick` sur le bouton : la touche Entrée doit soumettre le formulaire.
- **`value` sans `onChange`** rend le champ en lecture seule et affiche un avertissement dans la console. Les deux vont toujours ensemble.
- **`aria-describedby={erreur ? id : undefined}`** : passer une chaîne vide laisserait l'attribut en place et casserait la lecture d'écran.
- **`key={inscription.id}`**, jamais l'index du tableau — sinon la suppression d'un élément décale tous les autres.

## Critères de réussite

- [ ] Tous les champs sont contrôlés (`value` + `onChange`)
- [ ] Un seul objet d'état pour le formulaire, pas un `useState` par champ
- [ ] Le type `Erreurs` est dérivé de `Inscription` par `keyof`, pas réécrit
- [ ] `onSubmit` est sur le `<form>` : la touche Entrée fonctionne
- [ ] Chaque champ a un `<label htmlFor>` relié à l'`id` du champ
- [ ] Les erreurs sont annoncées par `aria-invalid` et `aria-describedby`
- [ ] La case à cocher est pilotée par `checked`, et le handler la distingue
- [ ] Le bouton est désactivé pendant l'envoi, avec un libellé d'attente
- [ ] Aucune mutation d'état (pas de `push`, pas d'affectation directe)
- [ ] Les mots de passe ne sont pas conservés dans la liste
- [ ] `npx tsc --noEmit` ne renvoie aucune erreur, et il n'y a aucun `any`
