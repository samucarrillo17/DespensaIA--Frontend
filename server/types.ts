/** Respuesta de /auth/register y /auth/login. */
export type AuthResponse = {
  id: string
  correo: string
  nombre: string
  /** ISO 8601. */
  createdAt: string
  token: string
}

export type Ingredient = {
  id: string
  nombre: string
  cantidad: number
  /** Unidad de medida, ej: "g", "ml", "uds". */
  unidad: string
}

export type RecipeDifficulty = "facil" | "media" | "dificil"

export type IngredienteReceta = {
  ingrediente: string
  cantidad: number
  /** Unidad de medida, ej: "g", "ml", "unds", "dientes", "cucharadas", "pizca". */
  unidad: string
}

export type Receta = {
  /** UUID v4. */
  id: string
  nombre: string
  descripcion: string
  ingredientes: IngredienteReceta[]
  /** Pasos ordenados → render directo en <li>. */
  pasos: string[]
  minutos: number
  dificultad: RecipeDifficulty
  /** ISO 8601. */
  createdAt: string
  /** Opcional: el backend no lo retorna en POST/PATCH. */
  deletedAt?: string | null
}

export type CreateRecetaDto = Omit<Receta, "id" | "createdAt" | "deletedAt">
export type UpdateRecetaDto = Partial<CreateRecetaDto>

export type Calificacion = {
  /** UUID v4. */
  id: string
  /** UUID de la receta calificada. */
  recetaId: string
  /** UUID del usuario que califica. */
  usuarioId: string
  /** Entero de 1 a 5. */
  puntaje: number
  /** Puede venir en null si el usuario nunca escribió un comentario. */
  comentario: string | null
  /** ISO 8601. */
  createdAt: string
}
