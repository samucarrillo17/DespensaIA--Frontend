"use client"

import { ChefHat, Clock, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { CreateRecetaDto } from "@/server/types"
import {
  DIFICULTAD_ETIQUETAS,
  formatIngredienteReceta,
} from "./recipe-format"

type GeneratedRecipeDialogProps = {
  recipe: CreateRecetaDto | null
  /** Al cerrar el modal (Cancelar, ESC o click fuera) la receta NO se guarda. */
  onOpenChange: (open: boolean) => void
  onSave: () => Promise<void>
  isSaving: boolean
}

export function GeneratedRecipeDialog({
  recipe,
  onOpenChange,
  onSave,
  isSaving,
}: GeneratedRecipeDialogProps) {
  return (
    <Dialog open={recipe !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {recipe && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl text-pretty">
                <Sparkles className="size-5 text-primary" aria-hidden="true" />
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

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={() => void onSave()} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
