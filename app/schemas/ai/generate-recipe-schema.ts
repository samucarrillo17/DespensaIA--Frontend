import { z } from "zod"

/** Payload que se envía a POST ai/generar-receta: { ingredientes: string[] }. */
export const generateRecetaSchema = z.object({
  ingredientes: z
    .array(z.string().min(1, { message: "Ingrediente sin nombre" }))
    .min(1, { message: "Selecciona al menos un ingrediente" }),
})

export type GenerateRecetaValues = z.infer<typeof generateRecetaSchema>

/**
 * Receta que devuelve la IA. Debe coincidir con el CreateRecetaDto del backend
 * porque al guardar se envía tal cual a POST recetas (sin id/createdAt).
 */
export const recetaGeneradaSchema = z.object({
  nombre: z.string().min(1, { message: "La receta no tiene nombre" }),
  descripcion: z.string().min(1, { message: "La receta no tiene descripción" }),
  ingredientes: z
    .array(
      z.object({
        ingrediente: z.string().min(1, { message: "Ingrediente sin nombre" }),
        cantidad: z
          .number({ message: "Cantidad inválida" })
          .positive({ message: "La cantidad debe ser mayor a 0" }),
        unidad: z.string().min(1, { message: "Unidad inválida" }),
      })
    )
    .min(1, { message: "La receta no tiene ingredientes" }),
  pasos: z
    .array(z.string().min(1, { message: "Paso vacío" }))
    .min(1, { message: "La receta no tiene pasos" }),
  minutos: z
    .number({ message: "Minutos inválidos" })
    .int({ message: "Los minutos deben ser un entero" })
    .positive({ message: "Los minutos deben ser mayores a 0" }),
  dificultad: z.enum(["facil", "media", "dificil"], {
    message: "Dificultad inválida",
  }),
})

export type RecetaGeneradaValues = z.infer<typeof recetaGeneradaSchema>
