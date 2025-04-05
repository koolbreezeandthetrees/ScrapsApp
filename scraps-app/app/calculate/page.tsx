"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllRecipeCategories } from "@/app/actions/recipes";
import { getAllCalculatedRecipes } from "@/app/actions/calculate";
import { CategoryRecipe, FullRecipeWithMissingInfo } from "@/types/types";
import CategoryList from "./_components/CategoryList";
import RecipeDetails from "./_components/RecipeDetails";
import RecipeList from "./_components/RecipeList";


export default function CalculatePage() {
  const { user } = useUser();
  const [categories, setCategories] = useState<CategoryRecipe[]>([]);
  const [recipes, setRecipes] = useState<FullRecipeWithMissingInfo[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] =
    useState<FullRecipeWithMissingInfo | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchData() {
      const catData = await getAllRecipeCategories();
      const recipeData = user ? await getAllCalculatedRecipes(user.id) : [];
      setCategories(catData);
      setRecipes(recipeData);
    }

    fetchData();
  }, [user]);

  const filteredByCategory = useMemo(() => {
    if (selectedCategoryId === null) return [];
    return recipes.filter((r) => r.category.id === selectedCategoryId);
  }, [recipes, selectedCategoryId]);

  const groupedByMissingCount = useMemo(() => {
    const groups: Record<number, FullRecipeWithMissingInfo[]> = {};
    for (const recipe of filteredByCategory) {
      if (!groups[recipe.missingCount]) groups[recipe.missingCount] = [];
      groups[recipe.missingCount].push(recipe);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([missingCount, recs]) => ({
        missingCount: parseInt(missingCount),
        recipes: recs,
      }));
  }, [filteredByCategory]);

  return (
    <div className="recipe-container-lists">
      <CategoryList
        categories={categories}
        onSelectCategory={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
      />
      <RecipeList
        groupedRecipes={groupedByMissingCount}
        selectedCategoryId={selectedCategoryId}
        onSelectRecipe={setSelectedRecipe}
      />
      <RecipeDetails recipe={selectedRecipe} />
    </div>
  );
}
