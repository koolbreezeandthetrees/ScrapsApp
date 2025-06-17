"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import {
  ingredient,
  unit,
  categoryIngredient,
  color,
} from "@/db/migrations/schema";
import { Ingredient } from "@/types/types";
import { redirect } from "next/navigation";

// =============== GET: ALL INGREDIENTS ===============
export async function getAllIngredients(): Promise<Ingredient[]> {
  return await db
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
}

// =============== GET: ALL INGREDIENTS ===============
export async function getAllIngredientNames(): Promise<string[]> {
  const result = await db
    .select({
      name: ingredient.name,
    })
    .from(ingredient)
    .orderBy(ingredient.name);

  return result.map((row) => row.name);
}

// =============== GET: INGREDIENT BY ID ===============
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
    .where(eq(ingredient.id, id))
    .limit(1);

  return result[0];
}

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

export async function getIngredientPlainById(id: number) {
  const result = await db
    .select()
    .from(ingredient)
    .where(eq(ingredient.id, id))
    .limit(1);

  return result[0]; // => Possibly undefined if not found
}