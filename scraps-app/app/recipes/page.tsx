"use server";

import RecipesClient from "./_components/RecipesClient";
import { getAllRecipeCategories, getAllRecipes } from "@/app/actions/recipes";

export default async function RecipesPage() {
  // Fetch categories
  const categories = await getAllRecipeCategories();
  // Fetch all recipes
  const recipes = await getAllRecipes();

  return <RecipesClient categories={categories} recipes={recipes} />;
}
