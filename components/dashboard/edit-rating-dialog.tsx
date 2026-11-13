"use client"

import { Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CreateCalificacionFormValues } from "@/app/schemas/ratings/calificacion-schema"
import type { Calificacion, Receta } from "@/server/types"
import { RatingForm } from "./rating-form"

type EditRatingDialogProps = {
  recipe: Receta | null
  /** Calificación actual de la receta, si existe. */
  calificacion: Calificacion | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CreateCalificacionFormValues) => void | Promise<void>
  isSubmitting: boolean
}

export function EditRatingDialog({
  recipe,
  calificacion,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: EditRatingDialogProps) {
  const abierta = recipe !== null

  return (
    <Dialog open={abierta} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        {recipe && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="size-4 text-amber-400" aria-hidden="true" />
                Tu calificación
              </DialogTitle>
              <DialogDescription>
                {calificacion
                  ? `Edita tu calificación para «${recipe.nombre}».`
                  : `Califica «${recipe.nombre}».`}
              </DialogDescription>
            </DialogHeader>

            {/* key: garantiza precarga fresca del formulario en cada apertura/receta. */}
            <RatingForm
              key={calificacion?.id ?? "nueva"}
              idReceta={recipe.id}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              submitLabel="Actualizar calificación"
              onCancel={() => onOpenChange(false)}
              defaultValues={
                calificacion
                  ? {
                      puntaje: calificacion.puntaje,
                      comentario: calificacion.comentario ?? "",
                    }
                  : undefined
              }
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
