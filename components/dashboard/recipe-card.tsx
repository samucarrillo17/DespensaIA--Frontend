"use client"

import { ChefHat, Clock, Eye, Heart, Trash2 } from "lucide-react"
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
import type { Receta } from "@/server/types"
import { DIFICULTAD_ETIQUETAS, formatIngredienteReceta } from "./recipe-format"

type RecipeCardProps = {
  recipe: Receta
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
  // Pendiente: el backend aún no expone «favorito»; el corazón se muestra inactivo hasta entonces.
  const favorite = false

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="leading-snug text-pretty">
          {recipe.nombre}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {recipe.descripcion}
        </CardDescription>
        {!hideFavoriteToggle && (
          <CardAction>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleFavorite}
              aria-pressed={favorite}
              className={cn(favorite && "text-primary hover:text-primary")}
            >
              <Heart
                className={cn(favorite && "fill-current")}
                aria-hidden="true"
              />
              <span className="sr-only">
                {favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              </span>
            </Button>
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
