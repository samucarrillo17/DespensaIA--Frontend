"use client"

import { useEffect, useState } from "react"
import { ListChecks, LogOut, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type {
  AddIngredientFormValues,
  UpdateIngredientFormValues,
} from "@/app/schemas/inventory/ingredient-schema"
import type { CreateCalificacionFormValues } from "@/app/schemas/ratings/calificacion-schema"
import {
  addIngredient,
  listIngredients,
  removeIngredient,
  updateIngredient,
} from "@/server/ingredients/actions"
import {
  createReceta,
  deleteReceta,
  listRecetas,
} from "@/server/recetas/actions"
import {
  createCalificacion,
  listCalificaciones,
  updateCalificacion,
} from "@/server/calificaciones/actions"
import { generarReceta } from "@/server/ai/actions"
import type {
  AuthResponse,
  Calificacion,
  CreateRecetaDto,
  Ingredient,
  Receta,
} from "@/server/types"
import { toast } from "@/components/ui/toast"
import { PantryTab } from "./pantry-tab"
import { RecipeGrid } from "./recipe-grid"
import { GeneratedRecipeDialog } from "./generated-recipe-dialog"
import { EditRatingDialog } from "./edit-rating-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"

import "blobatar/motion.css"
import { Blobatar } from "../ui/blobatar"
import { useRouter } from "next/navigation"
import { logout } from "@/server/auth/actions"

export function Dashboard() {
  const [tab, setTab] = useState<string>("pantry")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipes, setRecipes] = useState<Receta[]>([])
  const [isCargandoRecetas, setIsCargandoRecetas] = useState(true)
  const [activeUser, setActiveUser] = useState<AuthResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  /** Borrador de la receta generada por IA: solo se persiste al pulsar Guardar. */
  const [draftRecipe, setDraftRecipe] = useState<CreateRecetaDto | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  /** Calificaciones del usuario, indexadas por recetaId. */
  const [ratings, setRatings] = useState<Map<string, Calificacion>>(new Map())
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  /** Receta cuyo diálogo de edición de calificación está abierto. */
  const [editRatingRecipe, setEditRatingRecipe] = useState<Receta | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function cargarDatosIniciales() {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setActiveUser(JSON.parse(storedUser) as AuthResponse)
      }
      const resultado = await listIngredients()
      if (!resultado.ok) {
        toast.add({ type: "error", description: resultado.message })
        return
      }
      setIngredients(resultado.data)
    }
    void cargarDatosIniciales()
  }, [])

  useEffect(() => {
    async function cargarRecetas() {
      const resultado = await listRecetas()
      if (!resultado.ok) {
        toast.add({ type: "error", description: resultado.message })
      } else {
        setRecipes(resultado.data)
      }
      setIsCargandoRecetas(false)
    }
    void cargarRecetas()
  }, [])

  useEffect(() => {
    async function cargarCalificaciones() {
      const resultado = await listCalificaciones()
      if (!resultado.ok) {
        // Degradación aceptable: sin badges y el diálogo siempre muestra el
        // formulario de crear; el resto de la app sigue funcionando.
        toast.add({ type: "error", description: resultado.message })
        return
      }
      setRatings(new Map(resultado.data.map((c) => [c.recetaId, c])))
    }
    void cargarCalificaciones()
  }, [])

  async function handleCreate(values: AddIngredientFormValues) {
    const resultado = await addIngredient(values)
    if (!resultado.ok) {
      toast.add({ type: "error", description: resultado.message })
      return
    }
    setIngredients((prev) => [...prev, resultado.data])
    toast.add({ type: "success", description: "Ingrediente añadido" })
  }

  async function handleUpdate(id: string, values: UpdateIngredientFormValues) {
    const resultado = await updateIngredient(id, values)
    if (!resultado.ok) {
      toast.add({ type: "error", description: resultado.message })
      return
    }
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? resultado.data : i))
    )
    toast.add({ type: "success", description: "Ingrediente actualizado" })
  }

  async function handleDelete(id: string) {
    const resultado = await removeIngredient(id)
    if (!resultado.ok) {
      toast.add({ type: "error", description: resultado.message })
      return
    }
    setIngredients((prev) => prev.filter((i) => i.id !== id))
    toast.add({ type: "success", description: "Ingrediente eliminado" })
  }

  // ----------------- Recipes

  /** Genera la receta con AI a partir de los ingredientes seleccionados en la despensa. */
  async function handleGenerate(selected: Ingredient[]) {
    setIsGenerating(true)
    const resultado = await generarReceta(selected.map((i) => i.nombre))
    setIsGenerating(false)
    if (!resultado.ok) {
      toast.add({ type: "error", description: resultado.message })
      return
    }
    setDraftRecipe(resultado.data)
  }

  /** Guarda el borrador con el endpoint de crear receta. Cancelar/cerrar nunca persiste. */
  async function handleSaveDraft() {
    if (!draftRecipe || isSaving) return
    setIsSaving(true)
    const resultado = await createReceta(draftRecipe)
    setIsSaving(false)
    if (!resultado.ok) {
      toast.add({ type: "error", description: resultado.message })
      return
    }
    setRecipes((prev) => [resultado.data, ...prev])
    setDraftRecipe(null)
    setTab("recipes")
    toast.add({ type: "success", description: "Receta guardada" })
  }

  /**
   * Upsert de la calificación: PATCH si ya existe para la receta, POST si no.
   * Resuelve true solo si el backend lo confirmó (para cerrar diálogos).
   */
  async function handleRate(
    idReceta: string,
    values: CreateCalificacionFormValues
  ): Promise<boolean> {
    setIsSubmittingRating(true)
    const yaCalificada = ratings.has(idReceta)
    const resultado = yaCalificada
      ? await updateCalificacion(idReceta, values)
      : await createCalificacion(idReceta, values)
    setIsSubmittingRating(false)
    if (!resultado.ok) {
      toast.add({ type: "error", description: resultado.message })
      return false
    }
    setRatings((prev) => new Map(prev).set(idReceta, resultado.data))
    toast.add({
      type: "success",
      description: yaCalificada
        ? "Calificación actualizada"
        : "Calificación registrada",
    })
    setEditRatingRecipe(null)
    return true
  }

  async function logoutOnclick() {
    await logout()
    router.push("/login")
    localStorage.removeItem("user")
  }

  async function deleteRecipe(id: string) {
    const resultado = await deleteReceta(id)
    if (!resultado.ok) {
      toast.add({ type: "error", description: resultado.message })
      return
    }
    setRecipes((prev) => prev.filter((r) => r.id !== id))
    // La receta desaparece, también su calificación del estado local.
    setRatings((prev) => {
      const siguiente = new Map(prev)
      siguiente.delete(id)
      return siguiente
    })
    toast.add({ type: "success", description: "Receta eliminada" })
  }

  return (
    <div className="min-h-dvh bg-[#f6fffc]">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src="/icon.svg" className="size-12" alt="" />

            <div className="flex flex-col">
              <h1 className="text-md font-medium tracking-tight">
                Despensa IA
              </h1>
              <span className="text-xs text-muted-foreground">
                Recetas con lo que tienes en casa
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Blobatar
                    name={activeUser ? activeUser.nombre : "Usuario"}
                    blobatar={{
                      animate: "hover",
                    }}
                    className="h-10 w-10 rounded-full border border-slate-200"
                  />
                </Button>
              }
            />
            <DropdownMenuContent className="w-45">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  {activeUser ? activeUser.nombre : "nombre no encontrado"}
                </DropdownMenuLabel>
                <DropdownMenuLabel>
                  {activeUser ? activeUser.correo : "correo no encontrado"}
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={logoutOnclick}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Salir
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tight text-balance">
            Panel de cocina
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Registra tus ingredientes, genera recetas con IA y guarda tus
            recetas.
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(String(value))}
          className="gap-6"
        >
          <TabsList className="w-full max-sm:h-auto max-sm:flex-col max-sm:items-stretch sm:w-fit">
            <TabsTrigger value="pantry" className="gap-2 px-3 py-1.5">
              <Sparkles aria-hidden="true" />
              Crear receta
            </TabsTrigger>
            <TabsTrigger value="recipes" className="gap-2 px-3 py-1.5">
              <ListChecks aria-hidden="true" />
              Recetas generadas
              <Badge variant="secondary" className="ml-1">
                {recipes.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pantry">
            <PantryTab
              ingredients={ingredients}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </TabsContent>

          <TabsContent value="recipes">
            <RecipeGrid
              recipes={recipes}
              isLoading={isCargandoRecetas}
              ratings={ratings}
              onRate={handleRate}
              onEditRating={setEditRatingRecipe}
              isSubmittingRating={isSubmittingRating}
              onDelete={deleteRecipe}
              deleteLabel="Eliminar receta"
              deleteDescription="La receta se eliminará de tu historial."
              emptyTitle="Aún no hay recetas"
              emptyDescription="Añade ingredientes y pulsa «Generar receta con IA» para crear tu primera receta."
            />
          </TabsContent>
        </Tabs>
      </main>

      <GeneratedRecipeDialog
        recipe={draftRecipe}
        onOpenChange={(open) => {
          if (!open) setDraftRecipe(null)
        }}
        onSave={handleSaveDraft}
        isSaving={isSaving}
      />

      <EditRatingDialog
        recipe={editRatingRecipe}
        calificacion={
          editRatingRecipe ? (ratings.get(editRatingRecipe.id) ?? null) : null
        }
        onOpenChange={(open) => {
          if (!open) setEditRatingRecipe(null)
        }}
        onSubmit={async (values) => {
          if (editRatingRecipe) await handleRate(editRatingRecipe.id, values)
        }}
        isSubmitting={isSubmittingRating}
      />
    </div>
  )
}
