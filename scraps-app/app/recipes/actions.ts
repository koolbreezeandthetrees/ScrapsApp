"use server";

import { db } from "@/db";
import {
  recipe,
  categoryRecipe,
  recipeIngredient,
  ingredient,
  unit,
} from "@/db/migrations/schema";
import { eq } from "drizzle-orm";
import { CategoryRecipe } from "@/types/types";

/** Shape of a fully-joined recipe + ingredients. */
export interface FullRecipe {
  id: number;
  title: string;
  method: string;
  difficultyLevel: string;
  time: number;
  servings: number;
  image: string | null; // image can be null
  category: {
    id: number;
    name: string;
  };
  ingredients: Array<{
    quantityNeeded: number; // non-null
    name: string; // non-null
    unit: {
      name: string; // non-null
      abbreviation: string; // non-null
    };
  }>;
}

// =============== FETCH: RECIPE CATEGORIES ===============
/** Returns all recipe categories from `category_recipe`. */
export async function getAllRecipeCategories(): Promise<CategoryRecipe[]> {
  const rows = await db
    .select({
      id: categoryRecipe.id,
      name: categoryRecipe.name,
    })
    .from(categoryRecipe)
    .orderBy(categoryRecipe.name);

  return rows;
}

// =============== FETCH: ALL RECIPES (WITH INGREDIENTS) ===============
/**
 * Returns all recipes from `recipe`, joined with:
 *   - `category_recipe` (INNER JOIN, guaranteed no null)
 *   - `recipe_ingredient` (LEFT JOIN, can be null)
 *   - `ingredient` (LEFT JOIN, can be null)
 *   - `unit` (LEFT JOIN, can be null)
 *
 * Then we group them so each recipe has an `ingredients[]`.
 */
export async function getAllRecipes(): Promise<FullRecipe[]> {
  // 1. Query with JOINS:
  //    - `category_recipe` is an innerJoin, so catId/catName will never be null.
  //    - `recipeIngredient`, `ingredient`, and `unit` are leftJoin, so those fields can be null.
  const rows = await db
    .select({
      // recipe fields
      recipeId: recipe.id,
      title: recipe.title,
      method: recipe.method,
      difficulty: recipe.difficultyLevel,
      time: recipe.time,
      image: recipe.image,
      servings: recipe.servings,

      // category fields (innerJoin => never null)
      catId: categoryRecipe.id,
      catName: categoryRecipe.name,

      // recipeIngredient fields (leftJoin => can be null)
      recIngId: recipeIngredient.id,
      quantityNeeded: recipeIngredient.quantityNeeded,
      ingId: ingredient.id,
      ingName: ingredient.name,

      // unit fields (leftJoin => can be null)
      unitName: unit.name,
      unitAbbreviation: unit.abbreviation,
    })
    .from(recipe)
    // Since recipe.categoryRecipeId is not null, we can do innerJoin
    .innerJoin(categoryRecipe, eq(recipe.categoryRecipeId, categoryRecipe.id))
    .leftJoin(recipeIngredient, eq(recipe.id, recipeIngredient.recipeId))
    .leftJoin(ingredient, eq(recipeIngredient.ingredientId, ingredient.id))
    .leftJoin(unit, eq(recipeIngredient.unitId, unit.id));

  // 2. Group flat rows by recipeId into a Map
  const map = new Map<number, FullRecipe>();

  for (const row of rows) {
    // Create the recipe object if we haven't yet
    if (!map.has(row.recipeId)) {
      map.set(row.recipeId, {
        id: row.recipeId,
        title: row.title,
        method: row.method,
        difficultyLevel: row.difficulty,
        time: row.time,
        image: row.image ?? null, // ensure string | null
        servings: row.servings,
        category: {
          id: row.catId,
          name: row.catName,
        },
        ingredients: [],
      });
    }

    // If this row includes a recipeIngredient (recIngId != null),
    // add it to the recipe's ingredients array, coalescing nulls to safe defaults.
    if (row.recIngId !== null) {
      const recipeObj = map.get(row.recipeId)!;
      recipeObj.ingredients.push({
        quantityNeeded: row.quantityNeeded ?? 0,
        name: row.ingName ?? "Unknown Ingredient",
        unit: {
          name: row.unitName ?? "",
          abbreviation: row.unitAbbreviation ?? "",
        },
      });
    }
  }

  // 3. Return them as an array
  return [...map.values()];
}

// =============== CREATE RECIPE (SKELETON) ===============
/**
 * Example: Insert a new recipe into `recipe`.
 * For adding ingredients, you'd also insert into `recipe_ingredient`.
 * Adjust as needed to handle file uploads, etc.
 */
export async function createRecipe(formData: FormData) {
  const title = formData.get("title") as string;
  const method = formData.get("method") as string;
  const difficulty = formData.get("difficulty") as string;
  const timeVal = parseInt(formData.get("time") as string, 10);
  const servingsVal = parseInt(formData.get("servings") as string, 10);
  const categoryIdVal = parseInt(formData.get("category_id") as string, 10);

  // 1. Insert into `recipe`
  const [newRecipe] = await db
    .insert(recipe)
    .values({
      title,
      method,
      difficultyLevel: difficulty,
      time: timeVal,
      servings: servingsVal,
      categoryRecipeId: categoryIdVal,
      // image: ... (if handling file uploads)
    })
    .returning({ id: recipe.id, title: recipe.title });

  // 2. If you want to also insert recipe ingredients:
  // const ingredients = formData.getAll("ingredients[]");
  // const quantities = formData.getAll("quantities[]");
  // const units = formData.getAll("units[]");
  // ...
  // Then loop over them, insert into `recipeIngredient`, etc.

  return { success: true, recipeId: newRecipe.id };
}
