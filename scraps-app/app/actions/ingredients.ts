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
