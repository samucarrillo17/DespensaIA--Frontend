"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Ingredient } from "@/server/types"
import type { UpdateIngredientFormValues } from "@/app/schemas/inventory/ingredient-schema"
import { IngredientForm } from "./ingredient-form"

type IngredientRowProps = {
  ingredient: Ingredient
  selected: boolean
  onToggleSelect: (id: string) => void
  onUpdate: (id: string, values: UpdateIngredientFormValues) => void
  onDelete: (id: string) => void
}

export function IngredientRow({
  ingredient,
  selected,
  onToggleSelect,
  onUpdate,
  onDelete,
}: IngredientRowProps) {
  const [editing, setEditing] = useState(false)
  const checkboxId = `select-${ingredient.id}`

  return (
    <li
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors",
        selected && "bg-primary/5"
      )}
    >
      <Checkbox
        id={checkboxId}
        checked={selected}
        onCheckedChange={() => onToggleSelect(ingredient.id)}
      />
      <label
        htmlFor={checkboxId}
        className="flex-1 cursor-pointer truncate font-medium"
      >
        {ingredient.nombre}
      </label>
      <Badge variant="outline" className="font-mono tabular-nums">
        {ingredient.cantidad} {ingredient.unidad}
      </Badge>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)}>
          <Pencil aria-hidden="true" />
          <span className="sr-only">Editar {ingredient.nombre}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(ingredient.id)}
        >
          <Trash2 aria-hidden="true" />
          <span className="sr-only">Eliminar {ingredient.nombre}</span>
        </Button>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar ingrediente</DialogTitle>
            <DialogDescription>
              Actualiza el nombre, la cantidad o la unidad.
            </DialogDescription>
          </DialogHeader>
          <IngredientForm
            idPrefix={`edit-${ingredient.id}`}
            layout="stacked"
            initial={ingredient}
            submitLabel="Guardar cambios"
            onSubmit={(values) => {
              onUpdate(ingredient.id, values)
              setEditing(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </li>
  )
}
