"use server"

/** Server Actions para la tabla/entidad 'calificaciones' (backend real vía Axios). */

import {
  calificacionesResponseSchema,
  createCalificacionFormSchema,
} from "@/app/schemas/ratings/calificacion-schema"
import type { CreateCalificacionFormValues } from "@/app/schemas/ratings/calificacion-schema"
import { apiClient } from "@/server/lib/api-client"
import {
  actionFailure,
  actionSuccess,
  type ActionState,
} from "@/server/lib/api-errors"
import { getAuthHeader } from "@/server/lib/auth"
import type { Calificacion } from "@/server/types"

const RESOURCE_PATH = "calificaciones"

/**
 * Normaliza la respuesta de GET /calificaciones: el backend puede devolver el
 * array plano, un wrapper `{ data: [...] }` o un wrapper paginado de NestJS.
 * Si la forma no se reconoce o no valida contra el contrato, devuelve null
 * para que la Server Action falle de forma visible (en vez de ocultar el error
 * devolviendo una lista vacía).
 */
function extraerLista(data: unknown): Calificacion[] | null {
  let candidato: unknown = data

  if (!Array.isArray(candidato)) {
    if (!candidato || typeof candidato !== "object") return null

    const registro = candidato as Record<string, unknown>
    const claveArray = ["data", "items", "results", "calificaciones"].find(
      (clave) => Array.isArray(registro[clave])
    )
    if (!claveArray) {
      console.error(
        "[calificaciones] GET devolvió una forma no reconocida:",
        Object.keys(registro),
        data
      )
      return null
    }
    candidato = registro[claveArray]
  }

  const parsed = calificacionesResponseSchema.safeParse(candidato)
  if (!parsed.success) {
    console.error(
      "[calificaciones] GET devolvió datos que no cumplen el contrato:",
      parsed.error.issues
    )
    return null
  }
  return parsed.data
}

/** POST /calificaciones/:idReceta — solo acepta { puntaje, comentario }. */
export async function createCalificacion(
  idReceta: string,
  values: CreateCalificacionFormValues
): Promise<ActionState<Calificacion>> {
  const parsed = createCalificacionFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, message: "Datos de la calificación inválidos" }
  }
  // El comentario es opcional: solo se envía la clave cuando el usuario escribió algo.
  const { puntaje, comentario } = parsed.data
  try {
    const { data } = await apiClient.post<Calificacion>(
      `${RESOURCE_PATH}/${idReceta}`,
      { puntaje, ...(comentario ? { comentario } : {}) },
      { headers: await getAuthHeader() }
    )
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo registrar la calificación")
  }
}

/** GET /calificaciones — todas las calificaciones del usuario autenticado. */
export async function listCalificaciones(): Promise<
  ActionState<Calificacion[]>
> {
  try {
    const { data } = await apiClient.get<unknown>(RESOURCE_PATH, {
      headers: await getAuthHeader(),
    })
    const lista = extraerLista(data)
    if (!lista) {
      return {
        ok: false,
        message:
          "El servidor devolvió las calificaciones en un formato inesperado",
      }
    }
    return actionSuccess(lista)
  } catch (error) {
    return actionFailure(error, "No se pudieron cargar las calificaciones")
  }
}

/** PATCH /calificaciones/:idReceta — actualiza la calificación de una receta. */
export async function updateCalificacion(
  idReceta: string,
  values: CreateCalificacionFormValues
): Promise<ActionState<Calificacion>> {
  const parsed = createCalificacionFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, message: "Datos de la calificación inválidos" }
  }
  // Si el comentario llega vacío u omitido se envía sin la clave:
  // el backend lo interpreta y lo deja en null (borra el comentario anterior).
  const { puntaje, comentario } = parsed.data
  try {
    const { data } = await apiClient.patch<Calificacion>(
      `${RESOURCE_PATH}/${idReceta}`,
      { puntaje, ...(comentario ? { comentario } : {}) },
      { headers: await getAuthHeader() }
    )
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo actualizar la calificación")
  }
}
