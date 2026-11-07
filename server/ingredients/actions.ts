"use server"

/** Server Actions para la tabla/entidad 'ingredients' (backend real vía Axios). */

import { isAxiosError } from "axios"
import {
  addIngredientFormSchema,
  updateIngredientFormSchema,
  type AddIngredientFormValues,
  type UpdateIngredientFormValues,
} from "@/app/schemas/inventory/ingredient-schema"
import { apiClient } from "@/server/lib/api-client"
import { getAuthHeader } from "@/server/lib/auth"
import type { Ingredient } from "@/server/types"

const RESOURCE_PATH = "ingredientes"

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

export async function listIngredients(): Promise<Ingredient[]> {
  try {
    const { data } = await apiClient.get<Ingredient[]>(RESOURCE_PATH, {
      headers: await getAuthHeader(),
    })
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function getIngredient(id: string): Promise<Ingredient> {
  try {
    const { data } = await apiClient.get<Ingredient>(`${RESOURCE_PATH}/${id}`, {
      headers: await getAuthHeader(),
    })
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function addIngredient(
  values: AddIngredientFormValues
): Promise<Ingredient> {
  const parsed = addIngredientFormSchema.safeParse(values)
  if (!parsed.success) {
    throw new Error("Datos del ingrediente inválidos")
  }
  try {
    const { data } = await apiClient.post<Ingredient>(
      RESOURCE_PATH,
      parsed.data,
      { headers: await getAuthHeader() }
    )
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function updateIngredient(
  id: string,
  values: UpdateIngredientFormValues
): Promise<Ingredient> {
  const parsed = updateIngredientFormSchema.safeParse(values)
  if (!parsed.success) {
    throw new Error("Datos del ingrediente inválidos")
  }
  try {
    const { data } = await apiClient.patch<Ingredient>(
      `${RESOURCE_PATH}/${id}`,
      parsed.data,
      { headers: await getAuthHeader() }
    )
    return data
  } catch (error) {
    throw toReadableError(error)
  }
}

export async function removeIngredient(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`${RESOURCE_PATH}/${id}`, {
      headers: await getAuthHeader(),
    })
    return true
  } catch (error) {
    throw toReadableError(error)
  }
}
