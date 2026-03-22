# CLAUDE.md

Ce fichier fournit des indications à Claude Code (claude.ai/code) pour travailler dans ce dépôt.

## Commandes

```bash
npm run dev        # Démarrer le serveur de développement (port 3000)
npm run build      # Vérification TypeScript + build Vite
npm run preview    # Prévisualiser le build de production
npm run fix        # Formater le code avec Prettier
```

Aucun outil de test n'est configuré. Il n'y a pas de script de lint — Prettier (`npm run fix`) est le seul outil de formatage.

## Environnement

Copier `.env.sample` vers `.env.local` et renseigner `VITE_API_URL` avec l'URL de base de l'API backend (ex. `http://localhost:3310/api/`).

## Architecture

**Stack :** React 19 + TypeScript, Vite, React Router DOM 7, TanStack React Query 5, Zustand, Tailwind CSS 4, React Hook Form + Zod, icônes Lucide, animations Motion.

### Routing et gardes d'authentification

`src/app/Router.tsx` définit toutes les routes. Chaque route est encapsulée dans `<Public>` ou `<Private>` :

- `Public` — redirige les utilisateurs authentifiés (ex. `/login`)
- `Private` — redirige les utilisateurs non authentifiés vers `/login`

L'état d'authentification est déterminé par la présence d'un access token dans le stockage local sécurisé (`src/core/local/`). Il n'y a pas de middleware d'auth centralisé — les gardes sont au niveau des routes.

### Couche API

`src/core/config/api.ts` est le wrapper fetch unique. Il :

- Lit `VITE_API_URL` pour l'URL de base
- Injecte automatiquement `Authorization: Bearer <token>` depuis le stockage local sécurisé
- Accepte des génériques pour des réponses typées
- Lève une `ApiError` (depuis `src/core/errors/`) en cas de réponse non-OK

Les constantes des méthodes HTTP sont dans `src/core/constants/methods.ts`. Les endpoints API sont dans `src/core/constants/endpoints.ts`.

### Pattern de développement des fonctionnalités

**Ne jamais créer manuellement** la structure d'une feature ou ses fichiers de base.

```bash
./feature.sh <nom-feature>             # crée src/features/<nom>/{data,domain,presentation}/
./files.sh <nom-fichier> <nom-feature> # génère les fichiers de base pré-remplis
```

`files.sh` génère : `.dto.ts`, `.api.ts`, `.mapper.ts`, `.repository.impl.ts`, `.entity.ts`, `.repository.ts`, `.hook.ts`. Si la feature n'existe pas, il appelle automatiquement `feature.sh`.

Architecture stricte : **data** (dtos → api → mapper → repository.impl) → **domain** (entity → repository → hook) → **presentation** (pages, components).

Règles clés :

- Le hook instancie le repository **en dehors** de la fonction (une seule instance) et renomme tous les champs retournés pour éviter les conflits.
- La présentation consomme uniquement les hooks — aucun appel direct à l'API ou au repository.
- Les chemins de routes sont dans `src/core/constants/routes.ts`.

### Gestion d'état

- **État serveur :** React Query (`src/core/config/queryClient.ts`) — utiliser `useQuery`/`useMutation` pour toutes les données API.
- **État client :** Les stores Zustand vont dans `src/core/stores/` (actuellement vide).

### Conventions de code

Toujours utiliser les **fonctions fléchées**, sauf pour les composants React qui utilisent la déclaration `function`.

```ts
// ✅ Fonction fléchée
const getUser = async (id: string) => { ... }

// ✅ Composant React
function UserCard({ name }: Props) { ... }
```

### Styles

Classes utilitaires Tailwind CSS 4. Utiliser le helper `cn()` de `src/core/utils/` (encapsule `tailwind-merge`) pour combiner conditionnellement des classes CSS.

### Alias de chemin

`@/` pointe vers `src/` — à utiliser pour tous les imports internes au projet.
/clear
