"use server"

/** Server Actions para la tabla/entidad 'recetas' (backend real vía Axios). */

import { isAxiosError } from "axios"
import { apiClient } from "@/server/lib/api-client"
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

/** Traduce un error de Axios/backend a un Error con mensaje legible. */
function toReadableError(error: unknown): Error {
  if (isAxiosError(error)) {
    // Formato Nest estándar: { statusCode, message: string | string[], error }
    const data = error.response?.data as
      {
        statusCode?: number
        message?: string | string[]
        error?: string
      }
      | undefined

    let message: string | undefined
    if (Array.isArray(data?.message)) {
      message = (data.message as string[]).join("\n")
    } else {
      message = data?.message ?? data?.error
    }

    return new Error(
      message ??
        `El backend respondió con el estado ${
          error.response?.status ?? "desconocido"
        }`
    )
  }
  return error instanceof Error ? error : new Error(String(error))
}

export async function createReceta(
  dto: CreateRecetaDto
): Promise<Receta> {
  try {
    const { data } = await apiClient.post<Receta>(RESOURCE_PATH, dto, {
      headers: await getAuthHeader(),
    })
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function listRecetas(
  params?: { limit?: number; offset?: number }
): Promise<Receta[]> {
  const { limit, offset } = params ?? {}
  try {
    const { data } = await apiClient.get<Receta[]>(RESOURCE_PATH, {
      params: {
        limit: clampLimit(limit),
        offset: clampOffset(offset),
      },
      headers: await getAuthHeader(),
    })
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function getReceta(id: string): Promise<Receta> {
  try {
    const { data } = await apiClient.get<Receta>(`${RESOURCE_PATH}/${id}`, {
      headers: await getAuthHeader(),
    })
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function updateReceta(
  id: string,
  dto: UpdateRecetaDto
): Promise<Receta> {
  try {
    const { data } = await apiClient.patch<Receta>(
      `${RESOURCE_PATH}/${id}`,
      dto,
      { headers: await getAuthHeader() }
    )
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function deleteReceta(id: string): Promise<string> {
  try {
    const { data } = await apiClient.delete<DeleteRecetaResult>(
      `${RESOURCE_PATH}/${id}`,
      { headers: await getAuthHeader() }
    )
    return data.message
  } catch (error) {
    throw toReadableError(error)
  }
}
