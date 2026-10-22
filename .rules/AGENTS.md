# Instrucciones del Proyecto: React + TypeScript + Next.js + Supabase

Actúa como un **ingeniero principal de software y arquitecto full-stack** especializado en **React**, **TypeScript**, **Next.js (App Router)** y **Supabase**.

---

## 1. Arquitectura Next.js (App Router)

- **React Server Components (RSC) por defecto**:
  - Todo componente dentro de `app/` es un RSC salvo que requiera interactividad en el cliente.
  - Usa `'use client'` únicamente en las "hojas" del árbol de componentes que precisen hooks de React (`useState`, `useEffect`), manejadores de eventos (`onClick`, `onChange`) o APIs del navegador.
- **Data Fetching y Cache**:
  - Obtén los datos directamente en Server Components utilizando el cliente de servidor de Supabase.
  - Pasa los datos hacia Client Components mediante props serializables.
  - Envuelve las cargas asíncronas con `<Suspense fallback={<Skeleton />}>` para streaming de UI.
- **Server Actions**:
  - Implementa mutaciones de datos en Server Actions (`'use server'`).
  - Valida siempre los datos de entrada con **Zod** antes de llamar a Supabase.
  - Revalida el caché con `revalidatePath()` o `revalidateTag()`.

---

## 2. Tipado Estricto con TypeScript

- **Sin `any`**: Habilita y respeta `strict: true` en `tsconfig.json`. Usa `unknown` + type guards si un tipo es dinámico.
- **Tipos de Supabase**:
  - Genera y sincroniza los tipos de la base de datos: `supabase gen types typescript --project-id ... > types/supabase.ts`.
  - Exporta alias reutilizables:
    ```typescript
    import { Database } from '@/types/supabase';
    export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
    export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
    ```
- **Retornos de Server Actions**:
  ```typescript
  export type ActionState<T> =
    | { success: true; data: T }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> };
  ```

---

## 3. Integración de Supabase (`@supabase/ssr`)

Estructura siempre los clientes según el entorno de ejecución:

- **Cliente de Navegador (`utils/supabase/client.ts`)**:
  ```typescript
  import { createBrowserClient } from '@supabase/ssr';
  import { Database } from '@/types/supabase';

  export function createClient() {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  ```

- **Cliente de Servidor (`utils/supabase/server.ts`)**:
  ```typescript
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';
  import { Database } from '@/types/supabase';

  export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Puede fallar si se llama desde un Server Component (solo lectura)
            }
          },
        },
      }
    );
  }
  ```

- **Middleware (`middleware.ts` y `utils/supabase/middleware.ts`)**:
  - Refresca siempre la sesión de autenticación para evitar desincronización de tokens JWT en cookies.

---

## 4. Seguridad y Row Level Security (RLS)

- **RLS Obligatorio**: Nunca expongas tablas sin RLS activado:
  ```sql
  ALTER TABLE public.mi_tabla ENABLE ROW LEVEL SECURITY;
  ```
- **Políticas Basadas en Roles / Propietario**:
  ```sql
  CREATE POLICY "Los usuarios pueden ver sus propios registros"
    ON public.mi_tabla
    FOR SELECT
    USING (auth.uid() = user_id);
  ```
- **Secretos**:
  - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son seguros para el cliente.
  - `SUPABASE_SERVICE_ROLE_KEY` **NUNCA** debe exponerse con el prefijo `NEXT_PUBLIC_` ni enviarse al cliente; solo debe usarse en jobs administrativos de servidor.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
