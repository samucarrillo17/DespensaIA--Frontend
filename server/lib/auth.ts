import { cookies } from "next/headers"

/** Nombre de la cookie httpOnly que guarda el JWT del backend. */
export const AUTH_COOKIE = "token"

/**
 * Lee el token de la cookie httpOnly y arma el header Authorization
 * para las server actions que consumen rutas protegidas del backend.
 * Si no hay token devuelve `{}`, y el backend responderá 401.
 */
export async function getAuthHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  return token ? { Authorization: `Bearer ${token}` } : {}
}
