"use client"

import { Star } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  createCalificacionFormSchema,
  type CreateCalificacionFormValues,
} from "@/app/schemas/ratings/calificacion-schema"
import { cn } from "@/lib/utils"

type RatingFormProps = {
  /** UUID de la receta: solo se usa para ids de DOM accesibles. */
  idReceta: string
  onSubmit: (values: CreateCalificacionFormValues) => void | Promise<unknown>
  defaultValues?: {
    puntaje?: number
    comentario?: string
  }
  /** Prop del padre mientras la Server Action resuelve (además del estado de RHF). */
  isSubmitting?: boolean
  submitLabel: string
  /** Botón secundario «Cancelar» junto al submit (diálogos de edición). */
  onCancel?: () => void
}

const ESTRELLAS = [1, 2, 3, 4, 5] as const

export function RatingForm({
  idReceta,
  onSubmit,
  defaultValues,
  isSubmitting = false,
  submitLabel,
  onCancel,
}: RatingFormProps) {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting: isSubmittingRhf },
  } = useForm<CreateCalificacionFormValues>({
    resolver: zodResolver(createCalificacionFormSchema),
    defaultValues: {
      puntaje: defaultValues?.puntaje ?? 0,
      // El comentario puede llegar en null (GET/PATCH): se trata como "".
      comentario: defaultValues?.comentario ?? "",
    },
  })

  const puntajeSeleccionado = watch("puntaje")
  const enviando = isSubmitting || isSubmittingRhf

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values)
      })}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm leading-none font-medium">Puntaje</span>
        <div className="flex gap-0.5" role="radiogroup" aria-label="Puntaje">
          {ESTRELLAS.map((valor) => {
            const activa = valor <= puntajeSeleccionado
            return (
              <button
                key={valor}
                type="button"
                role="radio"
                aria-checked={puntajeSeleccionado === valor}
                aria-label={`Calificar con ${valor} estrella${valor > 1 ? "s" : ""}`}
                disabled={enviando}
                onClick={() =>
                  setValue("puntaje", valor, { shouldValidate: true })
                }
                className="rounded-md p-1 text-amber-400 transition-colors hover:text-amber-500 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <Star
                  className={cn("size-6", activa && "fill-current")}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
        {errors.puntaje ? (
          <p className="text-xs text-destructive">{errors.puntaje.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idReceta}-comentario`}>
          Deja un comentario (opcional)
        </Label>
        <textarea
          id={`${idReceta}-comentario`}
          rows={3}
          maxLength={500}
          placeholder="¿Qué te pareció la receta? Este comentario ayuda a mejorar las sugerencias con IA."
          aria-invalid={Boolean(errors.comentario)}
          disabled={enviando}
          {...register("comentario")}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
        />
        {errors.comentario ? (
          <p className="text-xs text-destructive">
            {errors.comentario.message}
          </p>
        ) : null}
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={enviando}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={enviando} className="flex-1">
          <Star aria-hidden="true" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
