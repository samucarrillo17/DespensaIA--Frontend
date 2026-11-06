import { z } from "zod"

export const addIngredientFormSchema = z.object({
  nombre: z
    .string()
    .min(2, { message: "Ingresa el nombre del ingrediente" })
    .max(72, { message: "El nombre no puede superar 72 caracteres" }),
  cantidad: z
    .number({ message: "Ingresa una cantidad válida" })
    .positive({ message: "La cantidad debe ser mayor a 0" }),
  unidad: z.string().min(1, { message: "Selecciona una unidad" }),
})

export type AddIngredientFormValues = z.infer<typeof addIngredientFormSchema>

export const updateIngredientFormSchema = addIngredientFormSchema

export type UpdateIngredientFormValues = AddIngredientFormValues

export const INGREDIENT_UNIT_OPTIONS = [
  { value: "g", label: "g (gramos)" },
  { value: "ml", label: "ml (mililitros)" },
  { value: "uds", label: "uds (unidades)" },
  { value: "kg", label: "kilogramo" },
  { value: "l", label: "litro" },
] as const
