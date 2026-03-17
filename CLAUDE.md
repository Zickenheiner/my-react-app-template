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

**Créer une nouvelle feature** (génère l'arborescence de dossiers) :
```bash
./feature.sh <nom-feature>
```
Crée `src/features/<nom>/` avec les dossiers : `data/` (datasources, repositories, mappers, dtos) et `domain/` (repositories, entities, hooks) et `presentation/` (pages, components).

**Créer les fichiers de base d'un domaine** dans une feature existante :
```bash
./files.sh <nom-fichier> <nom-feature>
```
Génère avec le contenu de base pré-rempli : `.api.ts`, `.repository.impl.ts`, `.mapper.ts`, `.dto.ts`, `.repository.ts`, `.entity.ts`, `.hook.ts`. Si la feature n'existe pas encore, `files.sh` appelle automatiquement `feature.sh`.

Chaque feature suit une **architecture en couches stricte** : **data** → **domain** → **presentation**.

---

#### `data/dtos/<name>.dto.ts`
Interfaces TypeScript qui reflètent exactement ce que l'API envoie/reçoit.
```ts
export interface TestRequestDto { test: string; }
export interface TestResponseDto { test: string; }
```

#### `data/datasources/<name>.api.ts`
Classe qui encapsule les appels HTTP via `request()`. Lit ses URLs depuis `endpoints.<name>`.
```ts
class TestApi {
  constructor(private readonly testBaseUrl = endpoints.test) {}

  async testGet(): Promise<TestResponseDto> {
    return request({ url: this.testBaseUrl.get, method: methods.GET });
  }

  async testPost(payload: TestRequestDto): Promise<TestResponseDto> {
    return request({ url: this.testBaseUrl.post, method: methods.POST, data: payload });
  }
}
```

#### `data/mappers/<name>.mapper.ts`
Transforme un DTO en entité domain.
```ts
class TestMapper {
  toEntity(dto: TestResponseDto): TestEntity {
    return { test: dto.test };
  }
}
```

#### `data/repositories/<name>.repository.impl.ts`
Implémente l'interface domain. Orchestre appel API + mapping.
```ts
class TestRepositoryImpl implements TestRepository {
  constructor(
    private readonly testApi = new TestApi(),
    private readonly testMapper = new TestMapper(),
  ) {}

  async testGet(): Promise<TestEntity> {
    return this.testMapper.toEntity(await this.testApi.testGet());
  }
}
```

---

#### `domain/entities/<name>.entity.ts`
Interface de la donnée métier (indépendante de l'API).
```ts
export interface TestEntity { test: string; }
```

#### `domain/repositories/<name>.repository.ts`
Interface du repository (contrat entre data et domain). Importe les DTOs pour les payloads.
```ts
export interface TestRepository {
  testGet(): Promise<TestEntity>;
  testPost(payload: TestRequestDto): Promise<TestEntity>;
}
```

#### `domain/hooks/<name>.hook.ts`
Hooks React Query exposés aux composants. Instancie le repository **en dehors** du hook (une seule instance). Renomme systématiquement les champs retournés pour éviter les conflits.
```ts
const repository = new TestRepositoryImpl();

export const useTestGet = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['testGet'],
    queryFn: () => repository.testGet(),
  });
  return { testGet: data, isPendingTestGet: isPending, errorTestGet: error };
};

export const useTestPost = () => {
  const { data, isPending, error } = useMutation<TestEntity, ApiError, TestRequestDto>({
    mutationFn: (payload) => repository.testPost(payload),
  });
  return { testPost: data, isPendingTestPost: isPending, errorTestPost: error };
};
```

---

#### `presentation/`
Pages et composants React qui consomment uniquement les hooks domain. Aucun appel direct à l'API ou au repository depuis la présentation.

Les chemins de routes sont centralisés dans `src/core/constants/routes.ts`. Les endpoints dans `src/core/constants/endpoints.ts`.

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
