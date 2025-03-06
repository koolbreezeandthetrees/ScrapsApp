// app/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { userInventory } from "./schema";
import { categoryIngredient } from "./schema";
import { categoryRecipe } from "./schema";
import { unit } from "./schema";
import { ingredient } from "./schema";
import { recipe } from "./schema";
import { userInventoryIngredient } from "./schema";

const pool = new Pool({
  connectionString: process.env.XATA_DATABASE_URL,
  max: 20,
});

export const db = drizzle(pool, {
  schema: { userInventory, categoryIngredient, categoryRecipe, unit, ingredient, recipe, userInventoryIngredient },
});