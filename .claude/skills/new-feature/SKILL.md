---
name: new-feature
description: Crée la structure complète d'une nouvelle feature et ses fichiers de base via feature.sh et files.sh
---

# Création d'une nouvelle feature

Ce projet suit une architecture stricte **data → domain → presentation**. Ne jamais créer manuellement les dossiers ou fichiers — toujours utiliser les scripts.

## Workflow

### 1. Créer la structure de la feature (si elle n'existe pas)

```bash
./feature.sh <nom-feature>
```

Crée : `src/features/<nom>/{data/{datasources,repositories,mappers,dtos},domain/{repositories,entities,hooks},presentation/{pages,components}}/`

### 2. Générer les fichiers pour chaque entité métier

```bash
./files.sh <nom-fichier> <nom-feature>
```

Génère ces 7 fichiers pré-remplis :

- `data/datasources/<nom>.api.ts` — appels HTTP via `request()` de `@/core/config/api`
- `data/repositories/<nom>.repository.impl.ts` — implémentation du repository
- `data/mappers/<nom>.mapper.ts` — conversion DTO → Entity
- `data/dtos/<nom>.dto.ts` — interfaces Request/Response DTO
- `domain/repositories/<nom>.repository.ts` — interface du repository
- `domain/entities/<nom>.entity.ts` — interface de l'entité métier
- `domain/hooks/<nom>.hook.ts` — hook React Query (à remplir)

> Si la feature n'existe pas encore, `files.sh` appelle automatiquement `feature.sh`.

## Règles d'implémentation

### Hook (`domain/hooks/<nom>.hook.ts`)

- Instancier le repository **en dehors** de la fonction hook (une seule instance)
- Renommer tous les champs retournés par `useQuery`/`useMutation` pour éviter les conflits
- Exemple :

```ts
const repo = new UserRepositoryImpl();

export const useGetUser = (id: string) => {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => repo.getById(id),
  });
  return { user, isUserLoading, userError };
};
```

### Présentation

- Consommer **uniquement** les hooks — jamais d'appel direct à l'API ou au repository
- Les routes sont dans `src/core/constants/routes.ts`
- Utiliser `cn()` de `@/core/utils/cn` pour les classes Tailwind conditionnelles

### Endpoints

- Ajouter le nouvel endpoint dans `src/core/constants/endpoints.ts`

## Conventions de code

- Fonctions fléchées pour tout, sauf les composants React (déclaration `function`)
- Imports internes avec l'alias `@/`
