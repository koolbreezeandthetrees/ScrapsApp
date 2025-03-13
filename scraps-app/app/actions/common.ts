"use server";

import { db } from "@/db";
import { unit, categoryIngredient, color } from "@/db/migrations/schema";

// =============== GET: ALL UNITS ===============
export async function getUnitList() {
  return await db
    .select({
      id: unit.id,
      name: unit.name,
      abbreviation: unit.abbreviation,
    })
    .from(unit)
    .orderBy(unit.name);
}

// =============== GET: ALL CATEGORIES ===============
export async function getCategoryIngredientList() {
  return await db
    .select({
      id: categoryIngredient.id,
      name: categoryIngredient.name,
      description: categoryIngredient.description,
    })
    .from(categoryIngredient)
    .orderBy(categoryIngredient.name);
}

// =============== GET: ALL COLORS ===============
export async function getColorList() {
  return await db
    .select({
      id: color.id,
      name: color.name,
      colorCode: color.colorCode,
    })
    .from(color)
    .orderBy(color.name);
}
