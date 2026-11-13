"use client"

import { useState } from "react"
import { Reveal } from "@awesome-reveal/react"
import { BookOpen } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { CreateCalificacionFormValues } from "@/app/schemas/ratings/calificacion-schema"
import type { Calificacion, Receta } from "@/server/types"
import { RecipeCard } from "./recipe-card"
import { RecipeDetailDialog } from "./recipe-detail-dialog"

type RecipeGridProps = {
  recipes: Receta[]
  isLoading?: boolean
  /** Calificaciones del usuario, indexadas por recetaId. */
  ratings: Map<string, Calificacion>
  /** Guardar/actualizar la calificación. true solo si el backend lo confirmó. */
  onRate: (
    idReceta: string,
    values: CreateCalificacionFormValues
  ) => Promise<boolean>
  /** Abrir el diálogo de edición de la calificación de una receta. */
  onEditRating: (recipe: Receta) => void
  isSubmittingRating?: boolean
  onDelete: (id: string) => void
  deleteLabel: string
  deleteDescription: string
  emptyTitle: string
  emptyDescription: string
}

export function RecipeGrid({
  recipes,
  isLoading = false,
  ratings,
  onRate,
  onEditRating,
  isSubmittingRating = false,
  onDelete,
  deleteLabel,
  deleteDescription,
  emptyTitle,
  emptyDescription,
}: RecipeGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = recipes.find((r) => r.id === selectedId) ?? null

  if (isLoading) {
    return null
  }

  if (recipes.length === 0) {
    return (
      <Reveal from="bottom" duration={700}>
        <Empty className="border border-dashed bg-background">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Reveal>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe, index) => (
          <Reveal
            key={recipe.id}
            from="bottom"
            duration={700}
            delay={Math.min(index, 5) * 100}
          >
            <RecipeCard
              recipe={recipe}
              rating={ratings.get(recipe.id)}
              onEditRating={() => onEditRating(recipe)}
              onView={() => setSelectedId(recipe.id)}
              onDelete={() => onDelete(recipe.id)}
              deleteLabel={deleteLabel}
              deleteDescription={deleteDescription}
            />
          </Reveal>
        ))}
      </div>
      <RecipeDetailDialog
        recipe={selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        hasRating={selected ? ratings.has(selected.id) : false}
        isSubmitting={isSubmittingRating}
        onRate={async (values) => {
          if (!selected) return false
          const ok = await onRate(selected.id, values)
          // El cierre con toast lo maneja el padre; aquí solo se cierra si hubo éxito.
          if (ok) setSelectedId(null)
          return ok
        }}
      />
    </>
  )
}
