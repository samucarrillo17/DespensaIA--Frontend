"use server"

/** Server Actions para el endpoint de IA del backend (generación de recetas con LLM). */

import {
  generateRecetaSchema,
  recetaGeneradaSchema,
} from "@/app/schemas/ai/generate-recipe-schema"
import { apiClient } from "@/server/lib/api-client"
import {
  actionFailure,
  actionSuccess,
  type ActionState,
} from "@/server/lib/api-errors"
import { getAuthHeader } from "@/server/lib/auth"
import type { CreateRecetaDto } from "@/server/types"

const RESOURCE_PATH = "ai/generar-receta"

/** El LLM tarda más que el timeout por defecto del apiClient (10s). */
const TIMEOUT_MS = 60_000

/**
 * Genera una receta a partir de la lista de nombres de ingredientes
 * seleccionados en la despensa. Endpoint protegido: manda el Bearer token.
 * La respuesta se valida contra el contrato de CreateRecetaDto para poder
 * guardarla tal cual con createReceta al confirmar en el modal.
 */
export async function generarReceta(
  ingredientes: string[]
): Promise<ActionState<CreateRecetaDto>> {
  const parsed = generateRecetaSchema.safeParse({ ingredientes })
  if (!parsed.success) {
    return {
      ok: false,
      message: "Selecciona al menos un ingrediente para generar la receta",
    }
  }
  try {
    const { data } = await apiClient.post(RESOURCE_PATH, parsed.data, {
      headers: await getAuthHeader(),
      timeout: TIMEOUT_MS,
    })
    const receta = recetaGeneradaSchema.safeParse(data)
    if (!receta.success) {
      return {
        ok: false,
        message: "La IA devolvió una receta con formato inválido. Inténtalo de nuevo",
      }
    }
    return actionSuccess(receta.data)
  } catch (error) {
    return actionFailure(error, "No se pudo generar la receta")
  }
}
