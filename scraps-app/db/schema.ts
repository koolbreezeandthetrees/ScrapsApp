import {
  pgTable,
  serial,
  text,
  integer,
  real,
} from "drizzle-orm/pg-core";

export const userInventory = pgTable("user_inventory", {
  id: serial("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
});

export const categoryIngredient = pgTable("category_ingredient", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const categoryRecipe = pgTable("category_recipe", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
});

export const unit = pgTable("unit", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation").notNull(),
});

export const color = pgTable("color", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(), 
  colorCode: text("color_code").notNull(), 
});

export const ingredient = pgTable("ingredient", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  unitId: integer("unit_id").notNull(),
  colorId: integer("color_id").notNull(),
  categoryIngredientId: integer("category_ingredient_id").notNull(),
});

export const recipe = pgTable("recipe", {
  id: serial("id").primaryKey().notNull(),
  title: text("title").notNull(),
  method: text("method").notNull(),
  difficultyLevel: text("difficulty_level").notNull(),
  time: integer("time").notNull(),
  image: text("image"),
  categoryRecipeId: integer("category_recipe_id").notNull(),
  servings: integer("servings").default(1).notNull(),
});

export const userInventoryIngredient = pgTable("user_inventory_ingredient", {
  id: serial("id").primaryKey().notNull(),
  inventoryId: integer("inventory_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  quantity: real("quantity").default(0).notNull(),
});

export const recipeIngredient = pgTable("recipe_ingredient", {
  id: serial("id").primaryKey().notNull(),
  recipeId: integer("recipe_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  unitId: integer("unit_id").notNull(),
  quantityNeeded: real("quantity_needed").notNull(),
});
