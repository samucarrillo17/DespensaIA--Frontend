import { z } from "zod"

export const createCalificacionFormSchema = z.object({
  puntaje: z
    .number({ message: "Ingresa un puntaje válido" })
    .int({ message: "El puntaje debe ser un número entero" })
    .min(1, { message: "El puntaje mínimo es 1" })
    .max(5, { message: "El puntaje máximo es 5" }),
  comentario: z
    .string()
    .trim()
    .max(500, { message: "El comentario no puede superar 500 caracteres" })
    .optional(),
})

export type CreateCalificacionFormValues = z.infer<
  typeof createCalificacionFormSchema
>

/** Forma de una calificación tal como la devuelve el backend. */
export const calificacionResponseSchema = z.object({
  id: z.string(),
  recetaId: z.string(),
  usuarioId: z.string(),
  puntaje: z.number().int().min(1).max(5),
  comentario: z.string().nullable(),
  createdAt: z.string(),
})

export const calificacionesResponseSchema = z.array(calificacionResponseSchema)
