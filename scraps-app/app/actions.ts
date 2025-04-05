"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  recipe,
  recipeIngredient,
  categoryRecipe,
  ingredient,
  unit,
  categoryIngredient,
  color,
  userInventory,
  userInventoryIngredient,
} from "@/db/migrations/schema";

import {
  CategoryIngredient,
  InventoryItem,
  FullRecipe,
  RecipeIngredient,
  Ingredient,
} from "@/types/types";
import { RecipeFormData } from "./recipes/[id]/edit/page";

/* -------------------------------------
   1. COMMON: UNITS, INGREDIENT CATEGORIES, COLORS
-------------------------------------- */
export async function getUnitList() {
  const results = await db
    .select({
      id: unit.id,
      name: unit.name,
      abbreviation: unit.abbreviation,
    })
    .from(unit)
    .orderBy(unit.name);

  return results; // => Unit[]
}

export async function getCategoryIngredientList() {
  const results = await db
    .select({
      id: categoryIngredient.id,
      name: categoryIngredient.name,
      description: categoryIngredient.description,
    })
    .from(categoryIngredient)
    .orderBy(categoryIngredient.name);

  return results; // => CategoryIngredient[]
}

export async function getColorList() {
  const results = await db
    .select({
      id: color.id,
      name: color.name,
      colorCode: color.colorCode,
    })
    .from(color)
    .orderBy(color.name);

  return results; // => Color[]
}

/* -------------------------------------
   2. INGREDIENTS
-------------------------------------- */
export async function getIngredientsByCategory() {
  const result = await db
    .select({
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      ingredientUnitId: ingredient.unitId,
      ingredientColorId: ingredient.colorId,
      categoryId: categoryIngredient.id,
      categoryName: categoryIngredient.name,
    })
    .from(ingredient)
    .leftJoin(
      categoryIngredient,
      eq(ingredient.categoryIngredientId, categoryIngredient.id)
    )
    .orderBy(categoryIngredient.name, ingredient.name);

  return result;
}

export async function getIngredientById(id: number) {
  const result = await db
    .select({
      id: ingredient.id,
      name: ingredient.name,
      unit: {
        id: unit.id,
        name: unit.name,
        abbreviation: unit.abbreviation,
      },
      color: {
        id: color.id,
        name: color.name,
        colorCode: color.colorCode,
      },
      category: {
        id: categoryIngredient.id,
        name: categoryIngredient.name,
      },
    })
    .from(ingredient)
    .innerJoin(unit, eq(ingredient.unitId, unit.id))
    .innerJoin(color, eq(ingredient.colorId, color.id))
    .innerJoin(
      categoryIngredient,
      eq(ingredient.categoryIngredientId, categoryIngredient.id)
    )
    .where(eq(ingredient.id, id))
    .limit(1);

  return result[0]; // => Possibly undefined if not found
}

// Minimal ingredient fetch
export async function getIngredientPlainById(id: number) {
  const result = await db
    .select()
    .from(ingredient)
    .where(eq(ingredient.id, id))
    .limit(1);

  return result[0]; // => Possibly undefined if not found
}

// CREATE INGREDIENT
export async function createIngredient(formData: FormData) {
  const name = formData.get("name") as string;
  const unitVal = parseFloat(String(formData.get("unit")));
  const colorVal = parseFloat(String(formData.get("color")));
  const categoryVal = parseFloat(String(formData.get("category")));

  const results = await db
    .insert(ingredient)
    .values({
      name,
      unitId: unitVal,
      colorId: colorVal,
      categoryIngredientId: categoryVal,
    })
    .returning({ id: ingredient.id });

  return results[0]?.id;
}

// UPDATE INGREDIENT
export async function updateIngredient(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const unitId = parseInt(String(formData.get("unit")), 10);
  const colorId = parseInt(String(formData.get("color")), 10);
  const categoryIngredientId = parseInt(String(formData.get("category")), 10);

  await db
    .update(ingredient)
    .set({
      name,
      unitId,
      colorId,
      categoryIngredientId,
    })
    .where(eq(ingredient.id, id));

  // For immediate redirect after update:
  redirect(`/ingredients`);
}

/* -------------------------------------
   3. INVENTORY
-------------------------------------- */
export async function checkInventory(userId: string) {
  const result = await db
    .select()
    .from(userInventory)
    .where(eq(userInventory.userId, userId))
    .limit(1);

  return result.length > 0;
}

export async function createInventory(userId: string) {
  await db.insert(userInventory).values({ userId });
}

// Fetch only colors that exist in the given category
export async function getColorListForCategory(categoryId: number) {
  const results = await db
    .select({
      id: color.id,
      name: color.name,
      colorCode: color.colorCode,
    })
    .from(ingredient)
    .innerJoin(color, eq(ingredient.colorId, color.id))
    .where(eq(ingredient.categoryIngredientId, categoryId))
    .groupBy(color.id, color.name, color.colorCode)
    .orderBy(color.name);

  return results;
}

// GET INVENTORY
export async function getInventory(userId: string): Promise<{
  categories: CategoryIngredient[];
  inventory: Record<number, InventoryItem[]>;
}> {
  // Get the user's inventory ID
  const userInv = await db
    .select({ id: userInventory.id })
    .from(userInventory)
    .where(eq(userInventory.userId, userId))
    .limit(1);

  if (userInv.length === 0) {
    // No inventory => return empty
    return { categories: [], inventory: {} };
  }

  const inventoryId = userInv[0].id;

  // Fetch all ingredients in user’s inventory
  const inventoryItems: InventoryItem[] = await db
    .select({
      id: ingredient.id,
      name: ingredient.name,
      quantity: userInventoryIngredient.quantity,
      unit: {
        id: unit.id,
        name: unit.name,
        abbreviation: unit.abbreviation,
      },
      categoryId: ingredient.categoryIngredientId,
    })
    .from(userInventoryIngredient)
    .innerJoin(
      ingredient,
      eq(userInventoryIngredient.ingredientId, ingredient.id)
    )
    .innerJoin(unit, eq(ingredient.unitId, unit.id))
    .where(eq(userInventoryIngredient.inventoryId, inventoryId));

  // Fetch all ingredient categories
  const categories = await db
    .select({
      id: categoryIngredient.id,
      name: categoryIngredient.name,
      description: categoryIngredient.description,
    })
    .from(categoryIngredient);

  // Build record of category => items
  const inventoryByCategory: Record<number, InventoryItem[]> =
    Object.fromEntries(
      categories.map((cat) => [
        cat.id,
        inventoryItems.filter((item) => item.categoryId === cat.id) ?? [],
      ])
    );

  return { categories, inventory: inventoryByCategory };
}

// Fetch ingredients filtered by category & color
export async function getIngredientsByColor(
  categoryId: number,
  colorId: number
) {
  const results = await db
    .select({
      id: ingredient.id,
      name: ingredient.name,
    })
    .from(ingredient)
    .where(
      and(
        eq(ingredient.categoryIngredientId, categoryId),
        eq(ingredient.colorId, colorId)
      )
    )
    .orderBy(ingredient.name);

  return results; // => { id, name }[]
}

// Add an ingredient to the user's inventory
export async function addIngredientToInventory(
  userId: string,
  ingredientId: number
) {
  // 1) Grab user’s inventory ID
  const userInv = await db
    .select({ id: userInventory.id })
    .from(userInventory)
    .where(eq(userInventory.userId, userId))
    .limit(1);

  if (userInv.length === 0) throw new Error("User inventory not found");
  const inventoryId = userInv[0].id;

  // 2) Check if ingredient is already in user’s inventory
  const existing = await db
    .select()
    .from(userInventoryIngredient)
    .where(
      and(
        eq(userInventoryIngredient.ingredientId, ingredientId),
        eq(userInventoryIngredient.inventoryId, inventoryId)
      )
    )
    .limit(1);

  // 3) If found => increment quantity, otherwise create
  if (existing.length > 0) {
    await db
      .update(userInventoryIngredient)
      .set({ quantity: existing[0].quantity + 1 })
      .where(eq(userInventoryIngredient.id, existing[0].id));
  } else {
    await db.insert(userInventoryIngredient).values({
      inventoryId,
      ingredientId,
      quantity: 1,
    });
  }

  return { success: true };
}

// Update Inventory Quantity
export async function updateInventoryQuantity(
  userId: string,
  ingredientId: number,
  change: number
) {
  // 1) Grab user’s inventory ID
  const userInv = await db
    .select({ id: userInventory.id })
    .from(userInventory)
    .where(eq(userInventory.userId, userId))
    .limit(1);

  if (userInv.length === 0) {
    throw new Error("User inventory not found");
  }

  const inventoryId = userInv[0].id;

  // 2) Find the specific ingredient row
  const existing = await db
    .select({
      id: userInventoryIngredient.id,
      quantity: userInventoryIngredient.quantity,
    })
    .from(userInventoryIngredient)
    .where(
      and(
        eq(userInventoryIngredient.inventoryId, inventoryId),
        eq(userInventoryIngredient.ingredientId, ingredientId)
      )
    )
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Ingredient not found in inventory");
  }

  const newQuantity = existing[0].quantity + change;

  // 3) If newQuantity <= 0 => remove it, else update
  if (newQuantity <= 0) {
    await db
      .delete(userInventoryIngredient)
      .where(eq(userInventoryIngredient.id, existing[0].id));
  } else {
    await db
      .update(userInventoryIngredient)
      .set({ quantity: newQuantity })
      .where(eq(userInventoryIngredient.id, existing[0].id));
  }

  return { success: true, newQuantity };
}

/* -------------------------------------
   4. RECIPES
-------------------------------------- */

// =============== FETCH: ALL RECIPE CATEGORIES ===============
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

// =============== FETCH: ALL RECIPES ===============

export async function getAllRecipes(): Promise<FullRecipe[]> {
  // 1) Query with JOINS
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
          category: { id: 0, name: "" }, // Not included in this query
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

// =============== FETCH: SINGLE RECIPE BY ID ===============
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
          category: { id: 0, name: "" },
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

// =============== FETCH: ALL INGREDIENTS (FULL SHAPE) ===============
export async function getAllIngredients(): Promise<Ingredient[]> {
  const rows = await db
    .select({
      id: ingredient.id,
      name: ingredient.name,
      unit: {
        id: unit.id,
        name: unit.name,
        abbreviation: unit.abbreviation,
      },
      category: {
        id: categoryIngredient.id,
        name: categoryIngredient.name,
        description: categoryIngredient.description,
      },
      color: {
        id: color.id,
        name: color.name,
        colorCode: color.colorCode,
      },
    })
    .from(ingredient)
    .innerJoin(unit, eq(ingredient.unitId, unit.id))
    .innerJoin(
      categoryIngredient,
      eq(ingredient.categoryIngredientId, categoryIngredient.id)
    )
    .innerJoin(color, eq(ingredient.colorId, color.id))
    .orderBy(ingredient.name);

  return rows; // => Ingredient[]
}

// =============== CREATE RECIPE (with optional image) ===============
interface CreateRecipeResult {
  success: boolean;
  recipeId?: number;
}

// export async function createRecipe(
//   formData: FormData
// ): Promise<CreateRecipeResult> {
//   try {
//     const title = formData.get("title") as string;
//     const method = formData.get("method") as string;
//     const difficulty = formData.get("difficulty") as string;
//     const timeVal = parseInt(String(formData.get("time")), 10);
//     const servingsVal = parseInt(String(formData.get("servings")), 10);
//     const categoryVal = parseInt(String(formData.get("category_id")), 10);

//     // Optional file upload
//     const imageFile = formData.get("image") as File | null;
//     let imageFilename: string | null = null;
//     if (imageFile && imageFile.size > 0) {
//       // Save or upload the file
//       imageFilename = "placeholder.jpg";
//     }

//     // Insert into "recipe" table
//     const [newRecipe] = await db
//       .insert(recipe)
//       .values({
//         title,
//         method,
//         difficultyLevel: difficulty,
//         time: timeVal,
//         servings: servingsVal,
//         categoryRecipeId: categoryVal,
//         image: imageFilename,
//       })
//       .returning({ id: recipe.id });

//     // TODO: If you want to handle recipe ingredients from formData:
//     // const ingIds = formData.getAll("ingredients[]");
//     // const qtys = formData.getAll("quantities[]");
//     // const units = formData.getAll("units[]");
//     // ...then insert each row in recipeIngredient.

//     return { success: true, recipeId: newRecipe.id };
//   } catch (error) {
//     console.error("Error creating recipe:", error);
//     return { success: false };
//   }
// }

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

    const imageUrl = formData.get("image_url") as string | null;

    // Insert into recipe table
    const [newRecipe] = await db
      .insert(recipe)
      .values({
        title,
        method,
        difficultyLevel: difficulty,
        time: timeVal,
        servings: servingsVal,
        categoryRecipeId: categoryVal,
        image: imageUrl ?? null,
      })
      .returning({ id: recipe.id });

    return { success: true, recipeId: newRecipe.id };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false };
  }
}


// =============== UPDATE RECIPE DETAILS ===============
export async function updateRecipe(recipeId: number, data: RecipeFormData) {
  
  const title = data.title;
  const method = data.method;
  const difficultyLevel = data.difficultyLevel;
  const timeVal = parseInt(data.time, 10);
  const servingsVal = parseInt(data.servings, 10);
  const categoryVal = parseInt(data.categoryRecipeId, 10);
  const imageUrl = data.image_url; // directly available

  await db
    .update(recipe)
    .set({
      title,
      method,
      difficultyLevel,
      time: timeVal,
      servings: servingsVal,
      categoryRecipeId: categoryVal,
      image: imageUrl ?? null, // save image URL or null
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
