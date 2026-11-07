import type { IngredienteReceta, RecipeDifficulty } from "@/server/types"

/** Etiquetas visibles de dificultad, tal como se muestran en el diseño. */
export const DIFICULTAD_ETIQUETAS: Record<RecipeDifficulty, string> = {
  facil: "Fácil",
  media: "Media",
  dificil: "Difícil",
}

/** Formatea un ingrediente de receta del backend como «300 g de arroz». */
export function formatIngredienteReceta(ingrediente: IngredienteReceta) {
  return `${ingrediente.cantidad} ${ingrediente.unidad} de ${ingrediente.ingrediente}`
}
