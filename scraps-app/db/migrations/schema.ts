import { pgTable, integer, text, real, pgSequence } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"


export const categoryIngredientIdSeq = pgSequence("category_ingredient_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const categoryRecipeIdSeq = pgSequence("category_recipe_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const ingredientIdSeq = pgSequence("ingredient_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const recipeIdSeq = pgSequence("recipe_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const recipeIngredientIdSeq = pgSequence("recipe_ingredient_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const unitIdSeq = pgSequence("unit_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const userInventoryIdSeq = pgSequence("user_inventory_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const userInventoryIngredientIdSeq = pgSequence("user_inventory_ingredient_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const colorIdSeq = pgSequence("color_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })

export const categoryIngredient = pgTable("category_ingredient", {
	id: integer().default(sql`nextval('category_ingredient_id_seq'::regclass)`).primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
});

export const categoryRecipe = pgTable("category_recipe", {
	id: integer().default(sql`nextval('category_recipe_id_seq'::regclass)`).primaryKey().notNull(),
	name: text().notNull(),
});

export const color = pgTable("color", {
	id: integer().default(sql`nextval('color_id_seq'::regclass)`).primaryKey().notNull(),
	name: text().notNull(),
	colorCode: text("color_code").notNull(),
});

export const ingredient = pgTable("ingredient", {
	id: integer().default(sql`nextval('ingredient_id_seq'::regclass)`).primaryKey().notNull(),
	name: text().notNull(),
	unitId: integer("unit_id").notNull(),
	categoryIngredientId: integer("category_ingredient_id").notNull(),
	colorId: integer("color_id").notNull(),
});

export const recipe = pgTable("recipe", {
	id: integer().default(sql`nextval('recipe_id_seq'::regclass)`).primaryKey().notNull(),
	title: text().notNull(),
	method: text().notNull(),
	difficultyLevel: text("difficulty_level").notNull(),
	time: integer().notNull(),
	image: text(),
	servings: integer().default(1).notNull(),
	categoryRecipeId: integer("category_recipe_id").notNull(),
});

export const recipeIngredient = pgTable("recipe_ingredient", {
	id: integer().default(sql`nextval('recipe_ingredient_id_seq'::regclass)`).primaryKey().notNull(),
	recipeId: integer("recipe_id").notNull(),
	ingredientId: integer("ingredient_id").notNull(),
	unitId: integer("unit_id").notNull(),
	quantityNeeded: real("quantity_needed").notNull(),
});

export const unit = pgTable("unit", {
	id: integer().default(sql`nextval('unit_id_seq'::regclass)`).primaryKey().notNull(),
	name: text().notNull(),
	abbreviation: text().notNull(),
});

export const userInventory = pgTable("user_inventory", {
	id: integer().default(sql`nextval('user_inventory_id_seq'::regclass)`).primaryKey().notNull(),
	userId: text("user_id").notNull(),
});

export const userInventoryIngredient = pgTable("user_inventory_ingredient", {
	id: integer().default(sql`nextval('user_inventory_ingredient_id_seq'::regclass)`).primaryKey().notNull(),
	inventoryId: integer("inventory_id").notNull(),
	ingredientId: integer("ingredient_id").notNull(),
	quantity: real().default(0).notNull(),
});
