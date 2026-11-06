# AGENTS.md

Frontend de "Smart Recipe Generator" (recetas con LLM a partir del inventario de ingredientes).
Proyecto Next.js con App Router — ver README.md para el objetivo y la estructura planeada.

## Comandos
- Gestor de paquetes: **pnpm siempre** (nunca npm/yarn). Es un paquete único, no un monorepo real.
- `pnpm dev` — servidor dev en http://localhost:3000
- `pnpm build` / `pnpm start` — build de producción / ejecutar build
- `pnpm lint` — ESLint (eslint-config-next core-web-vitals + TS)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm format` — Prettier solo sobre `**/*.{ts,tsx}`
- **No hay script `test`** (el README lo menciona, pero no existe): verificación = `lint` + `typecheck` + build.

## Stack y quirks
- Next.js 16 (App Router) + React 19 + TypeScript strict.
- Tailwind v4: **sin `tailwind.config`**; el tema es 100% CSS en `app/globals.css` (variables `@theme inline` en oklch). Editar ahí, no crear archivo de config.
- shadcn con estilo **base-nova** (`components.json`): usa **Base UI, no Radix**. Añadir componentes solo con el CLI (`pnpm dlx shadcn@latest add ...`) y no a mano, para no romper el estilo. Iconos: lucide-react.
- Alias de rutas `@/*` → raíz del repo (p. ej. `@/components`, `@/lib/utils`).
- Tema claro/oscuro vía next-themes: `components/theme-provider.tsx`; `suppressHydrationWarning` ya está en el layout raíz.
- Zod para validaciones de schemas de entrada de datos
- React-Hook-Form para validacion de formularios, debe trabajar en conjunto con zod para validar entrada de datos de formularios

## Convenciones del proyecto (README, sección "Reglas para Agentes")
- Toda persistencia o llamada simulada al backend va en Server Actions por tabla: `server/<tabla>/actions.ts` (ingredients, recipes, ratings, users) con directiva `'use server'`. Este directorio aún no existe; crearlo al implementar.
- Componentes reutilizables en `components/` con subcarpetas semánticas (`ui/`, `inventory/`, `recipes/`).
- `'use client'` únicamente en componentes con estado/eventos de navegador; preferir Server Components.

## Errores a evitar
- El árbol de directorios del README es **aspiracional** (server/, Dockerfile, .env.example, app/inventory…) — no asumir que existen; confirmar contra el código real antes de importar rutas.
- No instalar dependencias del ecosistema Radix ni reinventar componentes ya existentes en `components/ui/`.
