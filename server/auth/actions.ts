"use server"

/** Server Actions para la entidad 'auth' (backend real vía Axios). */

import { cookies } from "next/headers"
import { isAxiosError } from "axios"
import { apiClient } from "@/server/lib/api-client"
import { AUTH_COOKIE } from "@/server/lib/auth"
import { registerSchema, type RegisterFormValues } from "@/app/schemas/auth/register-schema"
import { loginSchema, type LoginFormValues } from "@/app/schemas/auth/login-schema"
import type { AuthResponse } from "@/server/types"

const RESOURCE_PATH = "auth"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 días

/** Traduce un error de Axios/backend a un Error con mensaje legible. */
function toReadableError(error: unknown): Error {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      { message?: string; error?: string } | undefined
    const message = data?.message ?? data?.error
    return new Error(
      message ??
        `El backend respondió con el estado ${
          error.response?.status ?? "desconocido"
        }`
    )
  }
  return error instanceof Error ? error : new Error(String(error))
}

/** Guarda el token del backend en una cookie httpOnly (solo accesible desde el servidor). */
async function guardarToken(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

export async function register(values: RegisterFormValues): Promise<AuthResponse> {
  const parsed = registerSchema.safeParse(values)
  if (!parsed.success) {
    throw new Error("Datos de registro inválidos")
  }
  try {
    const { data } = await apiClient.post<AuthResponse>(
      `${RESOURCE_PATH}/register`,
      parsed.data
    )
    await guardarToken(data.token)
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function login(values: LoginFormValues): Promise<AuthResponse> {
  const parsed = loginSchema.safeParse(values)
  if (!parsed.success) {
    throw new Error("Credenciales inválidas")
  }
  try {
    const { data } = await apiClient.post<AuthResponse>(
      `${RESOURCE_PATH}/login`,
      parsed.data
    )
    await guardarToken(data.token)
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

/** Cierra la sesión borrando la cookie del token (solo el servidor puede hacerlo). */
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}
