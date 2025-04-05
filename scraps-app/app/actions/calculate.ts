// app/actions/calculate.ts
"use server";

import { db } from "@/db";
import {
  categoryRecipe,
  ingredient,
  recipe,
  recipeIngredient,
  unit,
  userInventory,
  userInventoryIngredient,
} from "@/db/migrations/schema";
import { eq } from "drizzle-orm";
import { FullRecipeWithMissingInfo } from "@/types/types";

export async function getAllCalculatedRecipes(
  userId: string,
  categoryId?: number
): Promise<FullRecipeWithMissingInfo[]> {
  // 1. Get the user's inventory ID
  const userInv = await db
    .select({ id: userInventory.id })
    .from(userInventory)
    .where(eq(userInventory.userId, userId))
    .limit(1);

  if (userInv.length === 0) return [];

  const inventoryId = userInv[0].id;

  // 2. Get all ingredient IDs from user's inventory
  const inventoryRows = await db
    .select({ ingredientId: userInventoryIngredient.ingredientId })
    .from(userInventoryIngredient)
    .where(eq(userInventoryIngredient.inventoryId, inventoryId));

  const ownedIngredientIds = new Set(
    inventoryRows.map((row) => row.ingredientId)
  );

  // 3. Fetch all recipes with their ingredients
  const rows = await db
    .select({
      recipeId: recipe.id,
      title: recipe.title,
      method: recipe.method,
      time: recipe.time,
      servings: recipe.servings,
      difficultyLevel: recipe.difficultyLevel,
      image: recipe.image,
      categoryId: categoryRecipe.id,
      categoryName: categoryRecipe.name,
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      quantityNeeded: recipeIngredient.quantityNeeded,
      unitId: unit.id,
      unitName: unit.name,
      unitAbbreviation: unit.abbreviation,
    })
    .from(recipe)
    .innerJoin(categoryRecipe, eq(recipe.categoryRecipeId, categoryRecipe.id))
    .innerJoin(recipeIngredient, eq(recipe.id, recipeIngredient.recipeId))
    .innerJoin(ingredient, eq(recipeIngredient.ingredientId, ingredient.id))
    .leftJoin(unit, eq(recipeIngredient.unitId, unit.id));

  // 4. Group by recipeId and calculate missing ingredients
  const recipeMap = new Map<number, FullRecipeWithMissingInfo>();

  for (const row of rows) {
    if (!recipeMap.has(row.recipeId)) {
      recipeMap.set(row.recipeId, {
        id: row.recipeId,
        title: row.title,
        method: row.method,
        time: row.time,
        servings: row.servings,
        difficultyLevel: row.difficultyLevel,
        image: row.image ?? undefined,
        category: {
          id: row.categoryId,
          name: row.categoryName,
        },
        ingredients: [],
        missingIngredients: [],
        missingCount: 0,
      });
    }

    const recipeEntry = recipeMap.get(row.recipeId)!;

    const ingredientData = {
      ingredient: {
        id: row.ingredientId,
        name: row.ingredientName,
      },
      quantityNeeded: row.quantityNeeded ?? 0,
      unit: {
        id: row.unitId ?? 0,
        name: row.unitName ?? "",
        abbreviation: row.unitAbbreviation ?? "",
      },
      isMissing: !ownedIngredientIds.has(row.ingredientId),
    };

    recipeEntry.ingredients.push(ingredientData);

    if (ingredientData.isMissing) {
      recipeEntry.missingIngredients.push(ingredientData);
      recipeEntry.missingCount++;
    }
  }

  let result = Array.from(recipeMap.values());

  // 5. Filter by category if provided
  if (categoryId) {
    result = result.filter((r) => r.category.id === categoryId);
  }

  // 6. Sort by missingCount (ascending)
  result.sort((a, b) => a.missingCount - b.missingCount);

  return result;
}
