"use client"

import { ChefHat, Clock, Eye, Star, Trash2 } from "lucide-react"
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
import type { Calificacion, Receta } from "@/server/types"
import { DIFICULTAD_ETIQUETAS, formatIngredienteReceta } from "./recipe-format"

type RecipeCardProps = {
  recipe: Receta
  onView: () => void
  /** Calificación del usuario para esta receta, si existe. */
  rating?: Calificacion | null
  /** Abrir el diálogo de edición de la calificación. */
  onEditRating?: () => void
  onDelete: () => void
  deleteLabel: string
  deleteDescription: string
}

export function RecipeCard({
  recipe,
  onView,
  rating,
  onEditRating,
  onDelete,
  deleteLabel,
  deleteDescription,
}: RecipeCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="leading-snug text-pretty">
          {recipe.nombre}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {recipe.descripcion}
        </CardDescription>
        {rating && onEditRating && (
          <CardAction>
            <button
              type="button"
              title="Editar tu calificación"
              aria-label="Editar tu calificación"
              onClick={onEditRating}
              className="flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs font-medium transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Star
                className="size-3 fill-current text-amber-400"
                aria-hidden="true"
              />
              {rating.puntaje}
            </button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {recipe.minutos} min
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="size-3.5" aria-hidden="true" />
            {DIFICULTAD_ETIQUETAS[recipe.dificultad]}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {recipe.ingredientes.slice(0, 4).map((item, index) => (
            <Badge key={index} variant="secondary" className="font-normal">
              {formatIngredienteReceta(item)}
            </Badge>
          ))}
          {recipe.ingredientes.length > 4 && (
            <Badge variant="outline" className="font-normal">
              +{recipe.ingredientes.length - 4}
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
                {recipe.nombre}
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
