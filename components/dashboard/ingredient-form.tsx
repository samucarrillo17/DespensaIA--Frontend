"use client"

import { Plus, Save } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  addIngredientFormSchema,
  INGREDIENT_UNIT_OPTIONS,
  type AddIngredientFormValues,
} from "@/app/schemas/inventory/ingredient-schema"
import { cn } from "@/lib/utils"
import type { Ingredient } from "@/server/types"

type IngredientFormProps = {
  initial?: Ingredient
  onSubmit: (data: AddIngredientFormValues) => void | Promise<void>
  submitLabel?: string
  layout?: "inline" | "stacked"
  idPrefix?: string
}

export function IngredientForm({
  initial,
  onSubmit,
  submitLabel = "Añadir",
  layout = "inline",
  idPrefix = "new",
}: IngredientFormProps) {
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddIngredientFormValues>({
    resolver: zodResolver(addIngredientFormSchema),
    defaultValues: initial
      ? {
          nombre: initial.nombre,
          cantidad: initial.cantidad,
          unidad: initial.unidad,
        }
      : { nombre: "", unidad: "g" },
  })

  const stacked = layout === "stacked"

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values)
        if (!initial) {
          reset()
        }
      })}
      className={cn(
        "flex gap-3",
        stacked ? "flex-col" : "flex-col sm:flex-row sm:items-end"
      )}
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-nombre`}>Ingrediente</Label>
        <Input
          id={`${idPrefix}-nombre`}
          placeholder="Ej. Patatas"
          maxLength={72}
          aria-invalid={Boolean(errors.nombre)}
          {...register("nombre")}
        />
        {errors.nombre ? (
          <p className="text-xs text-destructive">{errors.nombre.message}</p>
        ) : null}
      </div>
      <div className="flex gap-3">
        <div
          className={cn("flex flex-col gap-1.5", stacked ? "flex-1" : "w-full sm:w-28")}
        >
          <Label htmlFor={`${idPrefix}-cantidad`}>Cantidad</Label>
          <Input
            id={`${idPrefix}-cantidad`}
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            placeholder="0"
            aria-invalid={Boolean(errors.cantidad)}
            {...register("cantidad", { valueAsNumber: true })}
          />
          {errors.cantidad ? (
            <p className="text-xs text-destructive">
              {errors.cantidad.message}
            </p>
          ) : null}
        </div>
        <div
          className={cn("flex flex-col gap-1.5", stacked ? "flex-1" : "w-full sm:w-28")}
        >
          <Label htmlFor={`${idPrefix}-unidad`}>Unidad</Label>
          <Controller
            name="unidad"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={`${idPrefix}-unidad`} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INGREDIENT_UNIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className={cn(stacked && "mt-2")}
      >
        {initial ? <Save aria-hidden="true" /> : <Plus aria-hidden="true" />}
        {submitLabel}
      </Button>
    </form>
  )
}
