"use server";

import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ingredient, unit, categoryIngredient, color, userInventory, userInventoryIngredient } from "@/db/migrations/schema";
import { db } from "@/db";
import { CategoryIngredient, InventoryItem } from "@/types/types";

// ----------------------------
// --------- COMMON -----------
// ----------------------------
export async function getUnitList() {
  const results = await db
    .select({
      id: unit.id,
      name: unit.name,
      abbreviation: unit.abbreviation,
    })
    .from(unit)
    .orderBy(unit.name);

  return results;
}
export async function getCategoryIngredientList() {
  const results = await db
    .select({
      id: categoryIngredient.id,
      name: categoryIngredient.name,
    })
    .from(categoryIngredient)
    .orderBy(categoryIngredient.name);

  return results;
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

  return results;
}
// ----------------------------
// ------- INGREDIENTS --------
// ----------------------------
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
// GET INGREDIENT BY ID
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

  return result[0];
}
//weg?
export async function getIngredientPlainById(id: number) {
  const result = await db
    .select()
    .from(ingredient)
    .where(eq(ingredient.id, id))
    .limit(1);

  return result[0]; // Return the first (and only) result
}
// CREATE INGREDIENT
export async function createIngredient(formData: FormData) {
  const name = formData.get("name") as string;
  const unit = parseFloat(String(formData.get("unit")));
  const color = parseFloat(String(formData.get("color")));
  const category = parseFloat(String(formData.get("category")));

  console.log("formData", formData);

  const results = await db
    .insert(ingredient)
    .values({
      name,
      unitId: unit,
      colorId: color,
      categoryIngredientId: category,
    })
    .returning({
      id: ingredient.id,
    });

  redirect(`/ingredients/${results[0].id}`);
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

  redirect(`/ingredients`);
}
// TODO DELETE INGREDIENT

// ----------------------------
// ------- INVENTORY ----------
// ----------------------------
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

// ✅ Fetch only colors that exist in the given category
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
    .groupBy(color.id, color.name, color.colorCode) // ✅ Ensure only unique colors
    .orderBy(color.name);

  return results;
}

// GET INVENTORTY
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
  
  if (!userInv) return { categories: [], inventory: {} };

  const inventoryId = userInv[0].id;

  // Fetch all ingredients in user's inventory
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

  // Ensure every category is included in inventoryByCategory (even if empty)
  const inventoryByCategory: Record<number, InventoryItem[]> =
    Object.fromEntries(
      categories.map((category) => [
        category.id,
        inventoryItems.filter((item) => item.categoryId === category.id) ?? [],
      ])
    );
  return { categories, inventory: inventoryByCategory };
}

// ✅ Fetch ingredients filtered by category & color
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
    .where(and(eq(ingredient.categoryIngredientId, categoryId),
        eq(ingredient.colorId, colorId)
      )
    )
    .orderBy(ingredient.name);

  return results;
}

// ✅ Add an ingredient to the user's inventory
export async function addIngredientToInventory(
  userId: string,
  ingredientId: number
) {
  // Get the user's inventory ID
  const userInv = await db
    .select({ id: userInventory.id })
    .from(userInventory)
    .where(eq(userInventory.userId, userId))
    .limit(1);

  if (!userInv) throw new Error("User inventory not found");

  const inventoryId = userInv[0].id;

  // Check if the ingredient is already in the user's inventory
  const existingIngredient = await db
    .select()
    .from(userInventoryIngredient)
    .where(eq(userInventoryIngredient.ingredientId, ingredientId))
    .limit(1);

  if (existingIngredient.length > 0) {
    // ✅ If already in inventory, increase quantity by 1
    await db
      .update(userInventoryIngredient)
      .set({
        quantity: existingIngredient[0].quantity + 1,
      })
      .where(eq(userInventoryIngredient.ingredientId, ingredientId));
  } else {
    // ✅ If not in inventory, insert a new row with quantity = 1
    await db.insert(userInventoryIngredient).values({
      inventoryId,
      ingredientId,
      quantity: 1,
    });
  }

  return { success: true };
}


// CREATE INVENTORY
// GET INVENTORY BY CATEGORY
// ADD INGREDIENT TO INVENTORY
// REMOVE INGREDIENT FROM INVENTORY

// ----------------------------
// -------- RECIPES -----------
// ----------------------------
// GET RECIPE BY ID
// GET RECIPES BY CATEGORY
// CREATE RECIPE
// UPDATE RECIPE
// DELETE RECIPE


// INVENTORY
// GET INVENTORY BY CATEGORY


// ----------------------------
// -------- CALCULATE ---------
// ----------------------------
