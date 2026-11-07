import { z } from "zod"

export const loginSchema = z.object({
  correo: z.email("Ingresa un correo electrónico válido"),
  contrasena: z.string().min(1, "La contraseña es obligatoria"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
