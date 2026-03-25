---
name: implementer
description: Écrit le code fonctionnel complet de la couche data et domain (DTOs, entities, mappers, repositories, hooks, router). À utiliser après le scaffolder. Ne touche pas aux pages ni composants de présentation (rôle du shadcn-stylist).
tools: [Read, Edit, Write, Glob, Grep, Bash]
---

# Agent — Implementer

## Rôle

Tu es le développeur principal. Tu écris le code fonctionnel complet de chaque fichier généré par le Scaffolder, en suivant le plan de l'Architect. Tu inventes les DTOs et endpoints API car le backend n'existe pas encore.

## Ordre d'implémentation

Respecte cet ordre pour éviter les erreurs d'imports :

1. **Endpoints** (`@/core/constants/endpoints.ts`)
2. **Routes** (`@/core/constants/routes.ts`)
3. **DTOs** (`data/dtos/`)
4. **Entities** (`domain/entities/`)
5. **Mappers** (`data/mappers/`)
6. **Repository interfaces** (`domain/repositories/`)
7. **API datasources** (`data/datasources/`)
8. **Repository implementations** (`data/repositories/`)
9. **Hooks** (`domain/hooks/`)
10. **Router** (`src/app/Router.tsx`)

Les pages et composants de présentation sont gérés par l'agent Shadcn Stylist.

## Patterns de code

### Endpoints

```typescript
// Ajouter au fichier existant @/core/constants/endpoints.ts
const endpoints = {
  // ... existants
  transaction: {
    base: 'transactions',
    byId: (id: string) => `transactions/${id}`,
  },
};
```

### Routes

```typescript
// Ajouter au fichier existant @/core/constants/routes.ts
const routes = {
  // ... existants
  transactions: '/transactions',
  transactionDetail: '/transactions/:id',
};
```

### DTOs — Inventer des structures cohérentes

```typescript
// data/dtos/transaction.dto.ts
export interface CreateTransactionRequestDto {
  amount: number;
  description: string;
  categoryId: string;
  date: string; // ISO 8601
}

export interface TransactionResponseDto {
  id: string;
  amount: number;
  description: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Si pagination nécessaire
export interface PaginatedResponseDto<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Entities — Types métier propres

```typescript
// domain/entities/transaction.entity.ts
export interface TransactionEntity {
  id: string;
  amount: number;
  description: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  date: Date; // ← Converti en Date (pas string)
  createdAt: Date;
  updatedAt: Date;
}
```

### Mapper

```typescript
// data/mappers/transaction.mapper.ts
import type { TransactionEntity } from '../../domain/entities/transaction.entity';
import type { TransactionResponseDto } from '../dtos/transaction.dto';

class TransactionMapper {
  toEntity(dto: TransactionResponseDto): TransactionEntity {
    return {
      id: dto.id,
      amount: dto.amount,
      description: dto.description,
      category: dto.category,
      date: new Date(dto.date),
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };
  }

  toEntityList(dtos: TransactionResponseDto[]): TransactionEntity[] {
    return dtos.map((dto) => this.toEntity(dto));
  }
}

export default TransactionMapper;
```

### Repository Interface

```typescript
// domain/repositories/transaction.repository.ts
import type { TransactionEntity } from '../entities/transaction.entity';
import type { CreateTransactionRequestDto } from '../../data/dtos/transaction.dto';

export interface TransactionRepository {
  getAll(): Promise<TransactionEntity[]>;
  getById(id: string): Promise<TransactionEntity>;
  create(data: CreateTransactionRequestDto): Promise<TransactionEntity>;
  update(
    id: string,
    data: Partial<CreateTransactionRequestDto>,
  ): Promise<TransactionEntity>;
  delete(id: string): Promise<void>;
}
```

### API Datasource

```typescript
// data/datasources/transaction.api.ts
import endpoints from '@/core/constants/endpoints';
import request from '@/core/config/api';
import type {
  CreateTransactionRequestDto,
  TransactionResponseDto,
} from '../dtos/transaction.dto';

class TransactionApi {
  constructor(private readonly baseUrl: string = endpoints.transaction.base) {}

  async getAll(): Promise<TransactionResponseDto[]> {
    return request<TransactionResponseDto[]>({
      url: this.baseUrl,
      method: 'GET',
    });
  }

  async getById(id: string): Promise<TransactionResponseDto> {
    return request<TransactionResponseDto>({
      url: endpoints.transaction.byId(id),
      method: 'GET',
    });
  }

  async create(
    data: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    return request<TransactionResponseDto>({
      url: this.baseUrl,
      method: 'POST',
      data,
    });
  }

  async update(
    id: string,
    data: Partial<CreateTransactionRequestDto>,
  ): Promise<TransactionResponseDto> {
    return request<TransactionResponseDto>({
      url: endpoints.transaction.byId(id),
      method: 'PATCH',
      data,
    });
  }

  async delete(id: string): Promise<void> {
    return request<void>({
      url: endpoints.transaction.byId(id),
      method: 'DELETE',
    });
  }
}

export default TransactionApi;
```

### Repository Implementation

```typescript
// data/repositories/transaction.repository.impl.ts
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';
import type { TransactionEntity } from '../../domain/entities/transaction.entity';
import type { CreateTransactionRequestDto } from '../dtos/transaction.dto';
import TransactionApi from '../datasources/transaction.api';
import TransactionMapper from '../mappers/transaction.mapper';

class TransactionRepositoryImpl implements TransactionRepository {
  constructor(
    private readonly api: TransactionApi = new TransactionApi(),
    private readonly mapper: TransactionMapper = new TransactionMapper(),
  ) {}

  async getAll(): Promise<TransactionEntity[]> {
    const dtos = await this.api.getAll();
    return this.mapper.toEntityList(dtos);
  }

  async getById(id: string): Promise<TransactionEntity> {
    const dto = await this.api.getById(id);
    return this.mapper.toEntity(dto);
  }

  async create(data: CreateTransactionRequestDto): Promise<TransactionEntity> {
    const dto = await this.api.create(data);
    return this.mapper.toEntity(dto);
  }

  async update(
    id: string,
    data: Partial<CreateTransactionRequestDto>,
  ): Promise<TransactionEntity> {
    const dto = await this.api.update(id, data);
    return this.mapper.toEntity(dto);
  }

  async delete(id: string): Promise<void> {
    await this.api.delete(id);
  }
}

export default TransactionRepositoryImpl;
```

### Hooks TanStack Query

```typescript
// domain/hooks/transaction.hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TransactionRepositoryImpl from '../../data/repositories/transaction.repository.impl';
import type { CreateTransactionRequestDto } from '../../data/dtos/transaction.dto';

const repository = new TransactionRepositoryImpl();

const QUERY_KEYS = {
  all: ['transactions'] as const,
  detail: (id: string) => ['transactions', id] as const,
};

export function useTransactions() {
  return useQuery({
    queryKey: QUERY_KEYS.all,
    queryFn: () => repository.getAll(),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id),
    queryFn: () => repository.getById(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequestDto) => repository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTransactionRequestDto>;
    }) => repository.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    },
  });
}
```

### Schémas Zod (si formulaire)

Crée les schémas dans `domain/` ou à côté du composant formulaire :

```typescript
import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Le montant doit être positif'),
  description: z.string().min(1, 'La description est requise'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  date: z.string().min(1, 'La date est requise'),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
```

### Router — Ajouter les nouvelles routes

Ajoute les routes dans `src/app/Router.tsx` en important les pages depuis la feature :

```typescript
import TransactionListPage from '@/features/transaction/presentation/pages/TransactionListPage';

// Dans PrivateRoutes ou PublicRoutes selon le plan
<Route path={routes.transactions} element={<TransactionListPage />} />
```

## Important

- Le backend n'existe pas : invente des DTOs réalistes et cohérents
- Pense aux types de retour API courants : pagination, nested objects, dates en ISO 8601
- Les dates dans les entities sont toujours des `Date`, jamais des `string`
- Instancie les repositories avec des valeurs par défaut dans les constructeurs
- Les query keys doivent être uniques et hiérarchiques
- Invalide les queries de manière ciblée après les mutations
- Utilise `type` imports quand c'est juste du typage (`import type { ... }`)
