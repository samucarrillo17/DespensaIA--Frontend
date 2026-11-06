"use client"

import { ChefHat, Clock, Eye, Heart, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import type { Recipe } from "@/lib/recipes"

type RecipeCardProps = {
  recipe: Recipe
  onView: () => void
  onToggleFavorite: () => void
  onDelete: () => void
  deleteLabel: string
  deleteDescription: string
  hideFavoriteToggle?: boolean
}

export function RecipeCard({
  recipe,
  onView,
  onToggleFavorite,
  onDelete,
  deleteLabel,
  deleteDescription,
  hideFavoriteToggle,
}: RecipeCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="leading-snug text-pretty">
          {recipe.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {recipe.description}
        </CardDescription>
        {!hideFavoriteToggle && (
          <CardAction>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleFavorite}
              aria-pressed={recipe.favorite}
              className={cn(
                recipe.favorite && "text-primary hover:text-primary"
              )}
            >
              <Heart
                className={cn(recipe.favorite && "fill-current")}
                aria-hidden="true"
              />
              <span className="sr-only">
                {recipe.favorite
                  ? "Quitar de favoritos"
                  : "Guardar en favoritos"}
              </span>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {recipe.minutes} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {recipe.servings} raciones
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="size-3.5" aria-hidden="true" />
            {recipe.difficulty}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recipe.ingredients.slice(0, 4).map((item) => (
            <Badge key={item} variant="secondary" className="font-normal">
              {item}
            </Badge>
          ))}
          {recipe.ingredients.length > 4 && (
            <Badge variant="outline" className="font-normal">
              +{recipe.ingredients.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1" onClick={onView}>
          <Eye aria-hidden="true" />
          Ver preparación
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              />
            }
          >
            <Trash2 aria-hidden="true" />
            <span className="sr-only">{deleteLabel}</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteLabel}</AlertDialogTitle>
              <AlertDialogDescription>
                {"«"}
                {recipe.title}
                {"». "}
                {deleteDescription}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
