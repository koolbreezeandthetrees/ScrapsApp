"use server";

import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import {
  userInventory
} from "@/db/migrations/schema";
import { CategoryIngredient, InventoryItem } from "@/types/types";
import { ingredient, color, unit, userInventoryIngredient, categoryIngredient } from "@/db/migrations/schema";


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
