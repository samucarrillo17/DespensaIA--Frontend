import axios from "axios"

const backendUrl = process.env.BACKEND_URL

if (!backendUrl) {
  throw new Error(
    "BACKEND_URL no está definida. Configúrala en el archivo .env (ej. http://localhost:3002/api/)."
  )
}

/**
 * Cliente HTTP compartido por todas las tablas (server-side).
 * Concatena BACKEND_URL + controlador + recurso en cada server action.
 */
export const apiClient = axios.create({
  baseURL: backendUrl,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
})
