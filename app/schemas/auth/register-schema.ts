import { z } from "zod"

export const registerSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  correo: z.email("Ingresa un correo electrónico válido"),
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede superar los 50 caracteres")
    .regex(/[A-Za-z]/, "La contraseña debe contener al menos una letra")
    .regex(/\d/, "La contraseña debe contener al menos un número"),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
