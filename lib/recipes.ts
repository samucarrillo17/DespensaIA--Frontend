import type { Ingredient } from "@/server/types"

export type { Ingredient }

export type Recipe = {
  id: string
  title: string
  description: string
  minutes: number
  servings: number
  difficulty: "Fácil" | "Media" | "Difícil"
  ingredients: string[]
  steps: string[]
  createdAt: string
  favorite: boolean
}

export const initialIngredients: Ingredient[] = [
  { id: "i1", nombre: "Arroz", cantidad: 500, unidad: "g" },
  { id: "i2", nombre: "Pechuga de pollo", cantidad: 400, unidad: "g" },
  { id: "i3", nombre: "Tomate", cantidad: 3, unidad: "uds" },
  { id: "i4", nombre: "Cebolla", cantidad: 2, unidad: "uds" },
  { id: "i5", nombre: "Aceite de oliva", cantidad: 250, unidad: "ml" },
  { id: "i6", nombre: "Huevos", cantidad: 6, unidad: "uds" },
]

export const initialRecipes: Recipe[] = [
  {
    id: "r1",
    title: "Arroz con pollo al sartén",
    description:
      "Un plato completo y reconfortante con arroz suelto, pollo dorado y sofrito de tomate.",
    minutes: 35,
    servings: 4,
    difficulty: "Media",
    ingredients: [
      "300 g de arroz",
      "400 g de pechuga de pollo",
      "2 unds de tomate",
      "1 unds de cebolla",
      "30 ml de aceite de oliva",
    ],
    steps: [
      "Corta el pollo en dados y salpimiéntalo.",
      "Dora el pollo en una sartén con el aceite de oliva y resérvalo.",
      "Sofríe la cebolla picada y el tomate rallado durante 8 minutos.",
      "Añade el arroz, remueve 1 minuto y cubre con el doble de agua.",
      "Incorpora el pollo, cocina a fuego medio 18 minutos y deja reposar 5 minutos.",
    ],
    createdAt: "2026-04-09",
    favorite: true,
  },
  {
    id: "r2",
    title: "Tortilla de cebolla y tomate",
    description: "Tortilla jugosa y rápida, ideal para una cena ligera.",
    minutes: 20,
    servings: 2,
    difficulty: "Fácil",
    ingredients: [
      "4 unds de huevos",
      "1 unds de cebolla",
      "1 unds de tomate",
      "20 ml de aceite de oliva",
    ],
    steps: [
      "Pica la cebolla en juliana y póchala con el aceite a fuego bajo.",
      "Añade el tomate en dados y cocina 3 minutos.",
      "Bate los huevos con sal y mézclalos con el sofrito.",
      "Cuaja la tortilla por ambos lados a fuego medio.",
    ],
    createdAt: "2026-04-10",
    favorite: false,
  },
]

const templates = [
  {
    prefix: "Salteado de",
    suffix: "al ajillo",
    minutes: 25,
    difficulty: "Fácil" as const,
  },
  {
    prefix: "Guiso casero de",
    suffix: "con hierbas",
    minutes: 45,
    difficulty: "Media" as const,
  },
  {
    prefix: "Bowl de",
    suffix: "estilo mediterráneo",
    minutes: 20,
    difficulty: "Fácil" as const,
  },
  {
    prefix: "Horneado de",
    suffix: "gratinado",
    minutes: 50,
    difficulty: "Difícil" as const,
  },
]

function portion(ingredient: Ingredient) {
  const amount =
    ingredient.unidad === "uds"
      ? Math.max(1, Math.ceil(ingredient.cantidad / 2))
      : Math.max(10, Math.round(ingredient.cantidad / 2 / 10) * 10)
  return `${amount} ${ingredient.unidad} de ${ingredient.nombre.toLowerCase()}`
}

export async function generateMockRecipe(
  ingredients: Ingredient[]
): Promise<Recipe> {
  await new Promise((resolve) => setTimeout(resolve, 1800))

  const template = templates[Math.floor(Math.random() * templates.length)]
  const main = ingredients[0].nombre.toLowerCase()
  const names = ingredients.map((i) => i.nombre.toLowerCase())
  const rest = names.slice(1)

  return {
    id: crypto.randomUUID(),
    title: `${template.prefix} ${main} ${template.suffix}`,
    description: `Receta creada a partir de tu despensa: ${names.join(", ")}.`,
    minutes: template.minutes,
    servings: 2 + Math.floor(Math.random() * 3),
    difficulty: template.difficulty,
    ingredients: ingredients.map(portion),
    steps: [
      "Lava y prepara todos los ingredientes antes de empezar.",
      `Corta ${main} en trozos uniformes y sazona al gusto.`,
      rest.length > 0
        ? `Cocina ${rest.join(", ")} a fuego medio durante 6-8 minutos.`
        : "Calienta una sartén amplia a fuego medio.",
      `Incorpora ${main} y cocina hasta que esté en su punto.`,
      "Rectifica de sal, deja reposar 2 minutos y sirve caliente.",
    ],
    createdAt: new Date().toISOString().slice(0, 10),
    favorite: false,
  }
}
