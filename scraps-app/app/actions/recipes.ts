"use server";

import { db } from "@/db";
import {
  categoryRecipe,
  ingredient,
  recipe,
  recipeIngredient,
  unit,
} from "@/db/migrations/schema";
import { eq } from "drizzle-orm";
import {
  FullRecipe,
  RecipeIngredient,
} from "@/types/types";

// =============== GET: ALL RECIPE CATEGORIES ===============
export async function getAllRecipeCategories() {
  const rows = await db
    .select({
      id: categoryRecipe.id,
      name: categoryRecipe.name,
    })
    .from(categoryRecipe)
    .orderBy(categoryRecipe.name);

  return rows; // => CategoryRecipe[]
}

// =============== GET: ALL RECIPES ===============
export async function getAllRecipes(): Promise<FullRecipe[]> {
  const rows = await db
    .select({
      recipeId: recipe.id,
      title: recipe.title,
      method: recipe.method,
      difficulty: recipe.difficultyLevel,
      time: recipe.time,
      image: recipe.image,
      servings: recipe.servings,

      catId: categoryRecipe.id,
      catName: categoryRecipe.name,

      recIngId: recipeIngredient.id,
      quantityNeeded: recipeIngredient.quantityNeeded,
      ingId: ingredient.id,
      ingName: ingredient.name,
      unitId: unit.id,
      unitName: unit.name,
      unitAbbreviation: unit.abbreviation,
    })
    .from(recipe)
    .innerJoin(categoryRecipe, eq(recipe.categoryRecipeId, categoryRecipe.id))
    .leftJoin(recipeIngredient, eq(recipe.id, recipeIngredient.recipeId))
    .leftJoin(ingredient, eq(recipeIngredient.ingredientId, ingredient.id))
    .leftJoin(unit, eq(recipeIngredient.unitId, unit.id));

  // 2) Group them by recipeId
  const recipeMap = new Map<number, FullRecipe>();

  for (const row of rows) {
    if (!recipeMap.has(row.recipeId)) {
      recipeMap.set(row.recipeId, {
        id: row.recipeId,
        title: row.title,
        method: row.method,
        difficultyLevel: row.difficulty,
        time: row.time,
        image: row.image ?? undefined,
        servings: row.servings,
        category: {
          id: row.catId,
          name: row.catName,
        },
        ingredients: [],
      });
    }
    // If there's a recipeIngredient row
    if (row.recIngId !== null) {
      recipeMap.get(row.recipeId)!.ingredients.push({
        id: row.recIngId,
        recipeId: row.recipeId,
        quantityNeeded: row.quantityNeeded ?? 0,
        ingredient: {
          id: row.ingId ?? 0,
          name: row.ingName ?? "",
          unit: {
            id: row.unitId ?? 0,
            name: row.unitName ?? "",
            abbreviation: row.unitAbbreviation ?? "",
          },
          category: { id: 0, name: "", description: "" }, // Not included in this query
          color: { id: 0, name: "", colorCode: "" },
        },
        unit: {
          id: row.unitId ?? 0,
          name: row.unitName ?? "",
          abbreviation: row.unitAbbreviation ?? "",
        },
      });
    }
  }

  return [...recipeMap.values()];
}

// =============== GET: SINGLE RECIPE BY ID ===============
export async function getRecipeById(
  recipeId: number
): Promise<FullRecipe | null> {
  const rows = await db
    .select({
      recipeId: recipe.id,
      title: recipe.title,
      method: recipe.method,
      difficulty: recipe.difficultyLevel,
      time: recipe.time,
      image: recipe.image,
      servings: recipe.servings,

      categoryId: categoryRecipe.id,
      categoryName: categoryRecipe.name,

      recIngId: recipeIngredient.id,
      quantityNeeded: recipeIngredient.quantityNeeded,

      ingId: ingredient.id,
      ingName: ingredient.name,
      unitId: unit.id,
      unitName: unit.name,
      unitAbbreviation: unit.abbreviation,
    })
    .from(recipe)
    .innerJoin(categoryRecipe, eq(recipe.categoryRecipeId, categoryRecipe.id))
    .leftJoin(recipeIngredient, eq(recipe.id, recipeIngredient.recipeId))
    .leftJoin(ingredient, eq(recipeIngredient.ingredientId, ingredient.id))
    .leftJoin(unit, eq(recipeIngredient.unitId, unit.id))
    .where(eq(recipe.id, recipeId));

  if (rows.length === 0) return null;

  // Build the base recipe object
  const recipeData: FullRecipe = {
    id: rows[0].recipeId,
    title: rows[0].title,
    method: rows[0].method,
    difficultyLevel: rows[0].difficulty,
    time: rows[0].time,
    image: rows[0].image ?? undefined,
    servings: rows[0].servings,
    category: {
      id: rows[0].categoryId,
      name: rows[0].categoryName,
    },
    ingredients: [],
  };

  // Fill ingredients
  for (const row of rows) {
    if (row.recIngId !== null) {
      recipeData.ingredients.push({
        id: row.recIngId,
        recipeId,
        quantityNeeded: row.quantityNeeded ?? 0,
        ingredient: {
          id: row.ingId ?? 0,
          name: row.ingName ?? "Unknown",
          unit: {
            id: row.unitId ?? 0,
            name: row.unitName ?? "",
            abbreviation: row.unitAbbreviation ?? "",
          },
          category: { id: 0, name: "", description: "" },
          color: { id: 0, name: "", colorCode: "" },
        },
        unit: {
          id: row.unitId ?? 0,
          name: row.unitName ?? "",
          abbreviation: row.unitAbbreviation ?? "",
        },
      });
    }
  }

  return recipeData;
}

// =============== CREATE RECIPE (with optional image) ===============
interface CreateRecipeResult {
  success: boolean;
  recipeId?: number;
}
export async function createRecipe(
  formData: FormData
): Promise<CreateRecipeResult> {
  try {
    const title = formData.get("title") as string;
    const method = formData.get("method") as string;
    const difficulty = formData.get("difficulty") as string;
    const timeVal = parseInt(String(formData.get("time")), 10);
    const servingsVal = parseInt(String(formData.get("servings")), 10);
    const categoryVal = parseInt(String(formData.get("category_id")), 10);

    // Optional file upload
    const imageFile = formData.get("image") as File | null;
    let imageFilename: string | null = null;
    if (imageFile && imageFile.size > 0) {
      // Save or upload the file
      imageFilename = "placeholder.jpg";
    }

    // Insert into "recipe" table
    const [newRecipe] = await db
      .insert(recipe)
      .values({
        title,
        method,
        difficultyLevel: difficulty,
        time: timeVal,
        servings: servingsVal,
        categoryRecipeId: categoryVal,
        image: imageFilename,
      })
      .returning({ id: recipe.id });

    // TODO: If you want to handle recipe ingredients from formData:
    // const ingIds = formData.getAll("ingredients[]");
    // const qtys = formData.getAll("quantities[]");
    // const units = formData.getAll("units[]");
    // ...then insert each row in recipeIngredient.

    return { success: true, recipeId: newRecipe.id };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false };
  }
}

// =============== POST: UPDATE RECIPE ===============
interface RecipeFormData {
  title: string;
  method: string;
  difficultyLevel: string;
  time: string;
  servings: string;
  categoryRecipeId: string;
}
export async function updateRecipe(recipeId: number, formData: RecipeFormData) {
  await db
    .update(recipe)
    .set({
      title: formData.title,
      method: formData.method,
      difficultyLevel: formData.difficultyLevel,
      time: parseInt(formData.time, 10),
      servings: parseInt(formData.servings, 10),
      categoryRecipeId: parseInt(formData.categoryRecipeId, 10),
    })
    .where(eq(recipe.id, recipeId));
}

// =============== UPDATE RECIPE INGREDIENTS ===============
export async function updateRecipeIngredients(
  recipeId: number,
  ingredients: RecipeIngredient[]
) {
  // 1) Remove existing
  await db
    .delete(recipeIngredient)
    .where(eq(recipeIngredient.recipeId, recipeId));

  // 2) Insert new
  await db.insert(recipeIngredient).values(
    ingredients.map((ing) => ({
      recipeId,
      ingredientId: ing.ingredient.id,
      unitId: ing.unit.id,
      quantityNeeded: ing.quantityNeeded,
    }))
  );
}
