import { isAxiosError } from "axios"

/**
 * Estado unificado que retornan los Server Actions en lugar de lanzar errores.
 *
 * Next.js reescribe (con un digest genérico) el mensaje de todo error lanzado
 * por un Server Action en builds de producción, así que el único modo confiable
 * de llevar un mensaje de negocio del backend al frontend es retornarlo como dato.
 */
export type ActionSuccess<T> = { ok: true; data: T }
export type ActionFailure = { ok: false; message: string }
export type ActionState<T> = ActionSuccess<T> | ActionFailure

export function actionSuccess<T>(data: T): ActionSuccess<T> {
  return { ok: true, data }
}

/**
 * Construye un fallo de Server Action con un mensaje legible a partir
 * de un error de Axios/backend. Logea el error original en el servidor.
 */
export function actionFailure(error: unknown, fallback: string): ActionFailure {
  console.error("[Server Action] Error:", error)
  return { ok: false, message: extractErrorMessage(error, fallback) }
}

/** Claves con prioridad para buscar el mensaje dentro del payload del backend. */
const MESSAGE_KEYS = [
  "message",
  "error",
  "mensaje",
  "detalle",
  "detail",
  "text",
]

/** Metadatos que no deben tratarse como campo de mensaje. */
const IGNORED_KEYS = new Set(["statusCode", "status", "timestamp", "path"])

const STATUS_FALLBACKS: Record<number, string> = {
  400: "Los datos enviados no son válidos",
  401: "Tu sesión no es válida. Vuelve a iniciar sesión",
  403: "No tienes permisos para realizar esta acción",
  404: "El recurso solicitado no existe",
  409: "Ya existe un registro con estos datos",
  429: "Demasiadas peticiones. Espera un momento e inténtalo de nuevo",
  500: "Error interno del servidor. Inténtalo de nuevo más tarde",
}

/**
 * Extrae el primer mensaje legible de un error, tanto si es un AxiosError
 * (con respuesta del backend) como un Error clásico o cualquier otra cosa.
 * `fallback` se usa cuando no se puede obtener un mensaje útil del error.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado"
): string {
  if (isAxiosError(error)) {
    const data = error.response?.data
    const encontrado = extraerDePayload(data)
    if (encontrado) return encontrado

    if (error.request && !error.response) {
      return "No se pudo conectar con el servidor. Inténtalo de nuevo"
    }
    const status = error.response?.status
    if (status && STATUS_FALLBACKS[status]) return STATUS_FALLBACKS[status]
    return fallback
  }

  if (error instanceof Error) {
    const mensaje = error.message.trim()
    if (mensaje) return mensaje
  }
  if (typeof error === "string" && error.trim()) return error.trim()

  return fallback
}

/**
 * Recorre el payload (JSON del backend) hasta encontrar un mensaje útil.
 * Soporta las formas que devuelve este backend y las estándar de NestJS:
 * - string plano
 * - `{ message: string }` / `{ message: { message: string, ... } }` (ExceptionFilter anidado)
 * - `{ message: string[] }` (ValidationPipe: se unen con "; ")
 * - errores por campo: `{ correo: "...", contrasena: "..." }`
 * Nunca genera "[object Object]".
 */
function extraerDePayload(data: unknown, depth = 0): string | undefined {
  if (depth > 4 || data === null || data === undefined) return undefined

  if (typeof data === "string") {
    const mensaje = data.trim()
    return mensaje || undefined
  }
  if (typeof data !== "object") return undefined

  if (Array.isArray(data)) {
    const items = data
      .map((item) => extraerDePayload(item, depth + 1))
      .filter((mensaje): mensaje is string => Boolean(mensaje))
    return items.length > 0 ? items.join("; ") : undefined
  }

  const registro = data as Record<string, unknown>

  // 1) claves de mensaje, en orden de prioridad
  for (const clave of MESSAGE_KEYS) {
    if (clave in registro) {
      const encontrado = extraerDePayload(registro[clave], depth + 1)
      if (encontrado) return encontrado
    }
  }

  // 2) errores por campo (se omiten metadatos como statusCode/timestamp)
  const deCampos = Object.entries(registro)
    .filter(
      ([clave, valor]) =>
        !IGNORED_KEYS.has(clave) &&
        !MESSAGE_KEYS.includes(clave) &&
        (typeof valor === "string" || typeof valor === "object") &&
        (Array.isArray(valor) ? valor.length > 0 : true)
    )
    .map(([, valor]) => extraerDePayload(valor, depth + 1))
    .filter((mensaje): mensaje is string => Boolean(mensaje))

  if (deCampos.length > 0) return deCampos.join("; ")
  return undefined
}
