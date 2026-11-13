"use client"

import { ChefHat, Clock, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CreateCalificacionFormValues } from "@/app/schemas/ratings/calificacion-schema"
import type { Receta } from "@/server/types"
import { DIFICULTAD_ETIQUETAS, formatIngredienteReceta } from "./recipe-format"
import { RatingForm } from "./rating-form"

type RecipeDetailDialogProps = {
  recipe: Receta | null
  onOpenChange: (open: boolean) => void
  /** El usuario ya calificó esta receta: el diálogo solo muestra preparación. */
  hasRating: boolean
  /** Debe resolver con true si la calificación se guardó (para cerrar el diálogo). */
  onRate: (values: CreateCalificacionFormValues) => Promise<boolean>
  isSubmitting?: boolean
}

export function RecipeDetailDialog({
  recipe,
  onOpenChange,
  hasRating,
  onRate,
  isSubmitting = false,
}: RecipeDetailDialogProps) {
  return (
    <Dialog open={recipe !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {recipe && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-pretty">
                {recipe.nombre}
              </DialogTitle>
              <DialogDescription>{recipe.descripcion}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {recipe.minutos} min
              </span>
              <span className="flex items-center gap-1.5">
                <ChefHat className="size-4" aria-hidden="true" />
                {DIFICULTAD_ETIQUETAS[recipe.dificultad]}
              </span>
            </div>

            <section className="flex flex-col gap-2">
              <h3 className="font-medium">Ingredientes</h3>
              <ul className="flex flex-col gap-1.5 text-sm">
                {recipe.ingredientes.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    {formatIngredienteReceta(item)}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="font-medium">Preparación</h3>
              <ol className="flex flex-col gap-3 text-sm">
                {recipe.pasos.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {!hasRating && (
              <section className="flex flex-col gap-2 rounded-xl border bg-muted/50 p-4">
                <h3 className="flex items-center gap-2 font-medium">
                  <Star
                    className="size-4 fill-current text-amber-400"
                    aria-hidden="true"
                  />
                  Califica esta receta
                </h3>
                <RatingForm
                  idReceta={recipe.id}
                  onSubmit={onRate}
                  isSubmitting={isSubmitting}
                  submitLabel="Enviar calificación"
                />
              </section>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
