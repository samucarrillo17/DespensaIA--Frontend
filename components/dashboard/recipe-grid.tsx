"use client"

import { useState } from "react"
import { BookOpen } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type { Receta } from "@/server/types"
import { RecipeCard } from "./recipe-card"
import { RecipeDetailDialog } from "./recipe-detail-dialog"

type RecipeGridProps = {
  recipes: Receta[]
  isLoading?: boolean
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
  deleteLabel: string
  deleteDescription: string
  emptyTitle: string
  emptyDescription: string
  hideFavoriteToggle?: boolean
}

export function RecipeGrid({
  recipes,
  isLoading = false,
  onToggleFavorite,
  onDelete,
  deleteLabel,
  deleteDescription,
  emptyTitle,
  emptyDescription,
  hideFavoriteToggle,
}: RecipeGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = recipes.find((r) => r.id === selectedId) ?? null

  if (isLoading) {
    return null
  }

  if (recipes.length === 0) {
    return (
      <Empty className="border border-dashed bg-background">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onView={() => setSelectedId(recipe.id)}
            onToggleFavorite={() => onToggleFavorite(recipe.id)}
            onDelete={() => onDelete(recipe.id)}
            deleteLabel={deleteLabel}
            deleteDescription={deleteDescription}
            hideFavoriteToggle={hideFavoriteToggle}
          />
        ))}
      </div>
      <RecipeDetailDialog
        recipe={selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onToggleFavorite={onToggleFavorite}
      />
    </>
  )
}
