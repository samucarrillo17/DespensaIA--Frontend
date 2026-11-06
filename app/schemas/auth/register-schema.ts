import { z } from "zod"

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  email: z.email("Ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede superar los 72 caracteres")
    .regex(/[A-Za-z]/, "La contraseña debe contener al menos una letra")
    .regex(/\d/, "La contraseña debe contener al menos un número"),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
