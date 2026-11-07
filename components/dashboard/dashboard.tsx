"use client"

import { useEffect, useState } from "react"
import { Heart, ListChecks, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type {
  AddIngredientFormValues,
  UpdateIngredientFormValues,
} from "@/app/schemas/inventory/ingredient-schema"
import {
  addIngredient,
  listIngredients,
  removeIngredient,
  updateIngredient,
} from "@/server/ingredients/actions"
import { deleteReceta, listRecetas } from "@/server/recetas/actions"
import type { Ingredient, Receta } from "@/server/types"
import { toast } from "@/components/ui/toast"
import { PantryTab } from "./pantry-tab"
import { RecipeGrid } from "./recipe-grid"

export function Dashboard() {
  const [tab, setTab] = useState<string>("pantry")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipes, setRecipes] = useState<Receta[]>([])
  const [isCargandoRecetas, setIsCargandoRecetas] = useState(true)

  useEffect(() => {
    async function cargarIngredientes() {
      try {
        const data = await listIngredients()
        setIngredients(data)
      } catch (error) {
        toast.add({
          type: "error",
          description:
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los ingredientes",
        })
      }
    }
    void cargarIngredientes()
  }, [])

  useEffect(() => {
    async function cargarRecetas() {
      try {
        const data = await listRecetas()
        setRecipes(data)
      } catch (error) {
        toast.add({
          type: "error",
          description:
            error instanceof Error
              ? error.message
              : "No se pudieron cargar las recetas",
        })
      } finally {
        setIsCargandoRecetas(false)
      }
    }
    void cargarRecetas()
  }, [])

  async function handleCreate(values: AddIngredientFormValues) {
    try {
      const creado = await addIngredient(values)
      setIngredients((prev) => [...prev, creado])
      toast.add({ type: "success", description: "Ingrediente añadido" })
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo añadir el ingrediente",
      })
    }
  }

  async function handleUpdate(id: string, values: UpdateIngredientFormValues) {
    try {
      const actualizado = await updateIngredient(id, values)
      setIngredients((prev) => prev.map((i) => (i.id === id ? actualizado : i)))
      toast.add({ type: "success", description: "Ingrediente actualizado" })
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el ingrediente",
      })
    }
  }

  async function handleDelete(id: string) {
    try {
      await removeIngredient(id)
      setIngredients((prev) => prev.filter((i) => i.id !== id))
      toast.add({ type: "success", description: "Ingrediente eliminado" })
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el ingrediente",
      })
    }
  }

// ----------------- Recipes
// Pendiente: el backend aún no expone «favorito»; la pestaña se mantiene vacía mientras tanto.
const favorites: Receta[] = []

// Pendiente: conectar con el endpoint de generación (LLM) del backend cuando exista.
function handleGenerate() {
  // La habilitación (requiere ingredientes seleccionados) vive en PantryTab.
}

function toggleFavorite() {
  // Sin efecto hasta que el backend exponga el campo «favorito».
}

async function deleteRecipe(id: string) {
  try {
    await deleteReceta(id)
    setRecipes((prev) => prev.filter((r) => r.id !== id))
    toast.add({ type: "success", description: "Receta eliminada" })
  } catch (error) {
    toast.add({
      type: "error",
      description:
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la receta",
    })
  }
}

function removeFavorite() {
  // Sin efecto hasta que el backend exponga el campo «favorito».
}

  return (
    <div className="min-h-dvh bg-[#f6fffc]">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 md:px-6">
          <img src="/icon.svg" className="size-12" alt="" />

          <div className="flex flex-col">
            <h1 className="text-md font-medium tracking-tight">Despensa IA</h1>
            <span className="text-xs text-muted-foreground">
              Recetas con lo que tienes en casa
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl tracking-tight text-balance">
            Panel de cocina
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            Registra tus ingredientes, genera recetas con IA y guarda tus
            favoritas.
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(String(value))}
          className="gap-6"
        >
          <TabsList className="h-auto w-full flex-wrap sm:w-fit">
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
            <TabsTrigger value="favorites" className="gap-2 px-3 py-1.5">
              <Heart aria-hidden="true" />
              Favoritos
              <Badge variant="secondary" className="ml-1">
                {favorites.length}
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
              isGenerating={false}
            />
          </TabsContent>

          <TabsContent value="recipes">
            <RecipeGrid
              recipes={recipes}
              isLoading={isCargandoRecetas}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteRecipe}
              deleteLabel="Eliminar receta"
              deleteDescription="La receta se eliminará de tu historial y de favoritos."
              emptyTitle="Aún no hay recetas"
              emptyDescription="Añade ingredientes y pulsa «Generar receta con IA» para crear tu primera receta."
            />
          </TabsContent>

          <TabsContent value="favorites">
            <RecipeGrid
              recipes={favorites}
              isLoading={isCargandoRecetas}
              onToggleFavorite={toggleFavorite}
              onDelete={removeFavorite}
              deleteLabel="Eliminar de favoritos"
              deleteDescription="La receta dejará de aparecer en favoritos, pero seguirá en tus recetas generadas."
              emptyTitle="No tienes favoritos"
              emptyDescription="Marca con el corazón las recetas generadas que quieras guardar."
              hideFavoriteToggle
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
