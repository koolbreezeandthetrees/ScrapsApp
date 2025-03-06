// app/recipes/page.tsx
import { getAllRecipeCategories, getAllRecipes } from "./actions";
import RecipesClient from "./RecipesClient";

export default async function RecipesPage() {
  // Fetch categories
  const categories = await getAllRecipeCategories();

  // Fetch all recipes
  const recipes = await getAllRecipes();

  return <RecipesClient categories={categories} recipes={recipes} />;
}
