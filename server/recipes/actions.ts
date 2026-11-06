"use server"

/**
 * Server Actions para la tabla/entidad 'recipes' — pendiente de migrar.
 *
 * El flujo actual de generación usa el mock `generateMockRecipe`
 * (lib/recipes.ts) directamente desde el dashboard. Cuando el backend
 * exponga el endpoint que recibe los ingredientes marcados, los envía
 * al modelo y guarda las recetas devueltas, se implementará aquí con
 * el mismo patrón de ingredients/actions.ts (Axios + BACKEND_URL).
 */
