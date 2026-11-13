"use server"

/** Server Actions para la tabla/entidad 'ingredients' (backend real vía Axios). */

import {
  addIngredientFormSchema,
  updateIngredientFormSchema,
  type AddIngredientFormValues,
  type UpdateIngredientFormValues,
} from "@/app/schemas/inventory/ingredient-schema"
import { apiClient } from "@/server/lib/api-client"
import {
  actionFailure,
  actionSuccess,
  type ActionState,
} from "@/server/lib/api-errors"
import { getAuthHeader } from "@/server/lib/auth"
import type { Ingredient } from "@/server/types"

const RESOURCE_PATH = "ingredientes"

export async function listIngredients(): Promise<ActionState<Ingredient[]>> {
  try {
    const { data } = await apiClient.get<Ingredient[]>(RESOURCE_PATH, {
      headers: await getAuthHeader(),
    })
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudieron cargar los ingredientes")
  }
}

export async function getIngredient(
  id: string
): Promise<ActionState<Ingredient>> {
  try {
    const { data } = await apiClient.get<Ingredient>(`${RESOURCE_PATH}/${id}`, {
      headers: await getAuthHeader(),
    })
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo cargar el ingrediente")
  }
}

export async function addIngredient(
  values: AddIngredientFormValues
): Promise<ActionState<Ingredient>> {
  const parsed = addIngredientFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, message: "Datos del ingrediente inválidos" }
  }
  try {
    const { data } = await apiClient.post<Ingredient>(
      RESOURCE_PATH,
      parsed.data,
      { headers: await getAuthHeader() }
    )
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo añadir el ingrediente")
  }
}

export async function updateIngredient(
  id: string,
  values: UpdateIngredientFormValues
): Promise<ActionState<Ingredient>> {
  const parsed = updateIngredientFormSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false, message: "Datos del ingrediente inválidos" }
  }
  try {
    const { data } = await apiClient.patch<Ingredient>(
      `${RESOURCE_PATH}/${id}`,
      parsed.data,
      { headers: await getAuthHeader() }
    )
    return actionSuccess(data)
  } catch (error) {
    return actionFailure(error, "No se pudo actualizar el ingrediente")
  }
}

export async function removeIngredient(id: string): Promise<ActionState<true>> {
  try {
    await apiClient.delete(`${RESOURCE_PATH}/${id}`, {
      headers: await getAuthHeader(),
    })
    return actionSuccess(true)
  } catch (error) {
    return actionFailure(error, "No se pudo eliminar el ingrediente")
  }
}
