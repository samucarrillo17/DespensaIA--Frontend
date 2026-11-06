export type Ingredient = {
  id: string
  nombre: string
  cantidad: number
  /** Unidad de medida, ej: "g", "ml", "uds". */
  unidad: string
}

export type RecipeDifficulty = "Fácil" | "Media" | "Difícil"

export type Recipe = {
  id: string
  /** Etiqueta superior de la tarjeta, ej: "Sugerencia principal de la IA". */
  tagline: string
  title: string
  description: string
  cookTimeMin: number
  calories: number
  difficulty: RecipeDifficulty
  /** Ingredientes que usa y ya están en la despensa. */
  usedIngredients: string[]
  /** Ingredientes que faltan (compras extra). */
  missingIngredients: string[]
  steps: string[]
  isSaved: boolean
}
