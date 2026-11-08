"use server"

/** Server Actions para la tabla/entidad 'recetas' (backend real vía Axios). */

import { apiClient } from "@/server/lib/api-client"
import {
  actionFailure,
  actionSuccess,
  type ActionState,
} from "@/server/lib/api-errors"
import { getAuthHeader } from "@/server/lib/auth"
import type {
  CreateRecetaDto,
  Receta,
  UpdateRecetaDto,
} from "@/server/types"

const RESOURCE_PATH = "recetas"
const LIMIT_MAXIMO = 100

/** Payload del DELETE: {"message": "Receta con id {id} eliminada"}. */
export type DeleteRecetaResult = { message: string }

function clampLimit(limit: number | undefined): number | undefined {
  if (limit === undefined) return undefined
  return Math.min(Math.max(1, limit), LIMIT_MAXIMO)
}

function clampOffset(offset: number | undefined): number | undefined {
  if (offset === undefined) return undefined
  return Math.max(0, offset)
}

export async function createReceta(
  dto: CreateRecetaDto
): Promise<ActionState<Receta>> {
  try {
    const { data } = await apiClient.post<Receta>(RESOURCE_PATH, dto, {
      headers: await getAuthHeader(),
    })
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo crear la receta")
  }
}

export async function listRecetas(
  params?: { limit?: number; offset?: number }
): Promise<ActionState<Receta[]>> {
  const { limit, offset } = params ?? {}
  try {
    const { data } = await apiClient.get<Receta[]>(RESOURCE_PATH, {
      params: {
        limit: clampLimit(limit),
        offset: clampOffset(offset),
      },
      headers: await getAuthHeader(),
    })
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudieron cargar las recetas")
  }
}

export async function getReceta(id: string): Promise<ActionState<Receta>> {
  try {
    const { data } = await apiClient.get<Receta>(`${RESOURCE_PATH}/${id}`, {
      headers: await getAuthHeader(),
    })
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo cargar la receta")
  }
}

export async function updateReceta(
  id: string,
  dto: UpdateRecetaDto
): Promise<ActionState<Receta>> {
  try {
    const { data } = await apiClient.patch<Receta>(
      `${RESOURCE_PATH}/${id}`,
      dto,
      { headers: await getAuthHeader() }
    )
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo actualizar la receta")
  }
}

export async function deleteReceta(id: string): Promise<ActionState<string>> {
  try {
    const { data } = await apiClient.delete<DeleteRecetaResult>(
      `${RESOURCE_PATH}/${id}`,
      { headers: await getAuthHeader() }
    )
    return actionSuccess(data.message)
  } catch (error) {
    return actionFailure(error, "No se pudo eliminar la receta")
  }
}
