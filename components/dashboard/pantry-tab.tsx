"use client"

import { useState } from "react"
import { Reveal } from "@awesome-reveal/react"
import { Loader2, Package, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import type {
  AddIngredientFormValues,
  UpdateIngredientFormValues,
} from "@/app/schemas/inventory/ingredient-schema"
import type { Ingredient } from "@/server/types"
import { IngredientForm } from "./ingredient-form"
import { IngredientRow } from "./ingredient-row"

type PantryTabProps = {
  ingredients: Ingredient[]
  onCreate: (values: AddIngredientFormValues) => void
  onUpdate: (id: string, values: UpdateIngredientFormValues) => void
  onDelete: (id: string) => void
  onGenerate: (selected: Ingredient[]) => void
  isGenerating: boolean
}

export function PantryTab({
  ingredients,
  onCreate,
  onUpdate,
  onDelete,
  onGenerate,
  isGenerating,
}: PantryTabProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const selected = ingredients.filter((i) => selectedIds.has(i.id))
  const allSelected =
    ingredients.length > 0 && selected.length === ingredients.length
  const someSelected = selected.length > 0 && !allSelected

  function deleteSelectedId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setSelectedIds(
      allSelected ? new Set() : new Set(ingredients.map((i) => i.id))
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Reveal from="bottom" duration={700}>
        <Card>
          <CardHeader>
            <CardTitle>Mis ingredientes</CardTitle>
            <CardDescription>
              Añade lo que tienes en casa y selecciona los que quieras usar para
              generar una receta.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <IngredientForm onSubmit={onCreate} />

            {ingredients.length === 0 ? (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Package />
                  </EmptyMedia>
                  <EmptyTitle>Aún no has añadido ingredientes</EmptyTitle>
                  <EmptyDescription>
                    Añade al menos un ingrediente para poder generar una receta.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <div className="flex items-center gap-3 border-b bg-muted/50 px-4 py-2.5">
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label
                    htmlFor="select-all"
                    className="flex-1 cursor-pointer text-sm font-medium"
                  >
                    Seleccionar todos
                  </label>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {selected.length} de {ingredients.length}
                  </span>
                </div>
                <ul
                  className="flex flex-col divide-y"
                  aria-label="Lista de ingredientes"
                >
                  {ingredients.map((ingredient) => (
                    <IngredientRow
                      key={ingredient.id}
                      ingredient={ingredient}
                      selected={selectedIds.has(ingredient.id)}
                      onToggleSelect={toggleSelect}
                      onUpdate={onUpdate}
                      onDelete={(id) => {
                        deleteSelectedId(id)
                        onDelete(id)
                      }}
                    />
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>

      <Reveal from="bottom" duration={700} delay={150}>
        <Card className="h-fit self-start bg-primary text-primary-foreground lg:sticky lg:top-6">
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <CardTitle className="text-lg">Generar receta con IA</CardTitle>
            <CardDescription
              className="text-primary-foreground/80"
              aria-live="polite"
            >
              {selected.length === 0
                ? "Selecciona uno o más ingredientes de tu despensa para generar una receta."
                : `Usaremos ${selected.length} ${
                    selected.length === 1
                      ? "ingrediente seleccionado"
                      : "ingredientes seleccionados"
                  } para crear tu receta.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {someSelected ? (
              <ul
                className="flex flex-wrap gap-1.5"
                aria-label="Ingredientes seleccionados"
              >
                {selected.map((i) => (
                  <li
                    key={i.id}
                    className="rounded-md bg-primary-foreground/15 px-2 py-0.5 text-xs font-medium"
                  >
                    {i.nombre}
                  </li>
                ))}
              </ul>
            ) : null}
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => onGenerate(selected)}
              disabled={selected.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 aria-hidden="true" className="animate-spin" />
                  Generando receta...
                </>
              ) : (
                <>
                  <Sparkles aria-hidden="true" />
                  Generar receta con IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}
