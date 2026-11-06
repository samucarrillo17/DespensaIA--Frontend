"use client"

import { ChefHat, Clock, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Recipe } from "@/lib/recipes"

type RecipeDetailDialogProps = {
  recipe: Recipe | null
  onOpenChange: (open: boolean) => void
  onToggleFavorite: (id: string) => void
}

export function RecipeDetailDialog({
  recipe,
  onOpenChange,
  onToggleFavorite,
}: RecipeDetailDialogProps) {
  return (
    <Dialog open={recipe !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        {recipe && (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg text-pretty">
                {recipe.title}
              </DialogTitle>
              <DialogDescription>{recipe.description}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {recipe.minutes} min
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" aria-hidden="true" />
                {recipe.servings} raciones
              </span>
              <span className="flex items-center gap-1.5">
                <ChefHat className="size-4" aria-hidden="true" />
                {recipe.difficulty}
              </span>
            </div>

            <section className="flex flex-col gap-2">
              <h3 className="font-medium">Ingredientes</h3>
              <ul className="flex flex-col gap-1.5 text-sm">
                {recipe.ingredients.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="font-medium">Preparación</h3>
              <ol className="flex flex-col gap-3 text-sm">
                {recipe.steps.map((step, index) => (
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
                variant={recipe.favorite ? "outline" : "default"}
                onClick={() => onToggleFavorite(recipe.id)}
              >
                <Heart
                  className={cn(recipe.favorite && "fill-current text-primary")}
                  aria-hidden="true"
                />
                {recipe.favorite
                  ? "Quitar de favoritos"
                  : "Guardar en favoritos"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
