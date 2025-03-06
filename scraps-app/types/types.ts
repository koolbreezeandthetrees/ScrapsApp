export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}

export interface CategoryIngredient {
  id: number;
  name: string;
  description: string;
}

export interface CategoryRecipe {
  id: number;
  name: string;
}

export interface Color {
  id: number;
  name: string;
  colorCode: string;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: Unit;
  category: CategoryIngredient;
  color: Color;
}

export interface UserInventoryIngredient {
  id: number;
  inventoryId: number;
  ingredientId: number;
  quantity: number;

}

export interface Recipe {
  id: number;
  title: string;
  method: string;
  difficultyLevel: string;
  time: number;
  image?: string;
  category: CategoryRecipe;
  servings: number;
}

export interface UserInventory {
  id: number;
  userId: string; // Matches Clerk's user ID (TEXT)
}

export interface UserInventoryIngredient {
  id: number;
  inventoryId: number;
  ingredient: Ingredient;
  quantity: number;
}

export interface RecipeIngredient {
  id: number;
  recipeId: number;
  ingredient: Ingredient;
  unit: Unit;
  quantityNeeded: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number; // Quantity from UserInventoryIngredient
  unit: Unit;
  categoryId: number;
}
