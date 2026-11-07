# Smart Recipe Generator - Frontend (Next.js)

Este repositorio contiene la aplicación **Frontend** para el proyecto de generación y gestión de recetas basadas en inventario de ingredientes disponible en casa, utilizando modelos de lenguaje (LLM). 

La aplicación está desarrollada con **Next.js** utilizando el **App Router**, enfocada en una arquitectura limpia, componentes reutilizables y simulación de persistencia mediante Server Actions organizados por dominio/tabla.

---

## 🎯 Objetivo del Proyecto

Construir e integrar una interfaz web moderna y funcional que permita a los usuarios:
1. **Gestionar Inventario:** Registrar y administrar ingredientes disponibles en casa.
2. **Generación con IA:** Enviar el inventario a un LLM para generar recetas personalizadas.
3. **Gestión de Recetas:** Guardar, calificar, listar y eliminar recetas persistidas.
4. **Despliegue:** Integrar prácticas de producción mediante contenedores Docker con soporte HTTPS en servidor real.

---

## 🏗️ Arquitectura y Estructura de Directorios

El código fuente se organiza siguiendo el patrón del App Router de Next.js, centralizando lógica modular en `app/`:

```text
/
├── public/                 # Archivos estáticos (imágenes, iconos, etc.)
│   ├── app/                # Rutas y páginas del App Router (Next.js)
│   │   ├── layout.tsx      # Layout raíz de la aplicación
│   │   ├── page.tsx        # Dashboard / Landing page
│   │   ├── inventory/      # Gestión de ingredientes
│   │   ├── recipes/        # Recetas generadas y guardadas
│   │   
│   │
│   ├── components/         # COMPONENTES REUTILIZABLES DE UI
│   │   ├── ui/             # Botones, Modales, Inputs, Cards, Badges, etc.
│   │   ├── inventory/      # Formularios y listas específicas de inventario
│   │   ├── recipes/        # Tarjetas de receta, visores de ingredientes, estrellas de calificación
│   │   └── layout/         # Navbar, Sidebar, Footer
│   │
├── server/             # SERVER ACTIONS (Simulación de llamadas backend por tabla BD)
│   ├── users/          # Server Actions para la tabla/entidad 'users'
│   │   └── actions.ts
│   ├── ingredients/    # Server Actions para la tabla/entidad 'ingredients'
│   │   └── actions.ts
│   ├── recipes/        # Server Actions para la tabla/entidad 'recipes'
│   │   └── actions.ts
│   └── ratings/        # Server Actions para la tabla/entidad 'ratings'
│   │     └── actions.ts
│   │
│   ├── lib/                # Configuración de clientes (DB, LLM, Utils)
│   └── globalcss           # Configuración global de CSS / Tailwind
│
├── .env.example            # Variables de entorno requeridas
├── Dockerfile              # Dockerfile listo para entorno de producción
├── docker-compose.yml      # Configuración de contenedores
├── package.json
└── README.md
```

---

## 🛠️ Reglas y Convenciones de Desarrollo (Para Agentes y Desarrolladores)

### 1. Componentes Reutilizables (`components/`)
- Todo componente visual que se pueda reutilizar debe habitar dentro de `components/`.
- Usar subcarpetas semánticas (`ui/`, `inventory/`, `recipes/`).
- Fomentar la separación entre Server Components y Client Components (añadir `'use client'` únicamente donde exista interactividad de estado o eventos del navegador).

### 2. Server Actions y Persistencia (`server/`)
- Toda interacción con la base de datos o simulación de backend debe procesarse en `server/<tabla>/actions.ts`.
- **Estructura por Tabla BD:**
  - `server/ingredients/actions.ts`: CRUD de ingredientes del inventario.
  - `server/recetas/actions.ts`: Generación con LLM, almacenamiento y borrado de recetas.
  - `server/ratings/actions.ts`: Calificación y retroalimentación de recetas.
  - `server/users/actions.ts`: Gestión de perfil/usuario.
- Todos los métodos exportados en estas carpetas deben llevar la directiva `'use server'` al inicio de la función o del archivo.

---

## 🚀 Requisitos de Integración Backend & LLM

- **LLM Integration:** Los Server Actions en `server/recetas/actions.ts` se conectan con el modelo de lenguaje (OpenAI, Groq, Ollama, etc.) enviando la lista de ingredientes activos para construir el prompt y estructurar la receta generada.
- **Persistencia:** Almacenamiento directo o simulado de recetas y calificaciones en la base de datos configurada.

---

## 📦 Despliegue y Docker

El proyecto cuenta con empaquetado Docker optimizado para producciones bajo HTTPS:

```bash
# Construcción de la imagen Docker
docker build -t recipe-app-frontend .

# Ejecución del contenedor
docker run -p 3000:3000 recipe-app-frontend
```

---

## 📜 Scripts Disponibles

-  `pnpm dev`: Inicia el servidor de desarrollo en `http://localhost:3000`.
-  `pnpm build`: Compila la aplicación para producción.
-  `pnpm start`: Inicia el servidor de producción compilado.
-  `pnpm test`: Ejecuta las pruebas unitarias.