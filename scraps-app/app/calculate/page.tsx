"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllRecipeCategories } from "@/app/actions/recipes";
import { getAllCalculatedRecipes } from "@/app/actions/calculate";
import { CategoryRecipe, FullRecipeWithMissingInfo } from "@/types/types";
import CategoryList from "./_components/CategoryList";
import RecipeDetails from "./_components/RecipeDetails";
import RecipeList from "./_components/RecipeList";
import { Stack, Box, CircularProgress } from "@mui/material";

export default function CalculatePage() {
  const { user } = useUser();
  const [categories, setCategories] = useState<CategoryRecipe[]>([]);
  const [recipes, setRecipes] = useState<FullRecipeWithMissingInfo[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] =
    useState<FullRecipeWithMissingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if there's no signed-in user, bail out
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    // now TS knows `user.id` is a string
    const userId = user.id;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [catData, recipeData] = await Promise.all([
          getAllRecipeCategories(),
          getAllCalculatedRecipes(userId),
        ]);
        setCategories(catData);
        setRecipes(recipeData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const filteredByCategory = useMemo(() => {
    if (selectedCategoryId === null) return [];
    return recipes.filter((r) => r.category.id === selectedCategoryId);
  }, [recipes, selectedCategoryId]);

  const groupedByMissingCount = useMemo(() => {
    const groups: Record<number, FullRecipeWithMissingInfo[]> = {};
    filteredByCategory.forEach((recipe) => {
      if (!groups[recipe.missingCount]) groups[recipe.missingCount] = [];
      groups[recipe.missingCount].push(recipe);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([count, recs]) => ({ missingCount: Number(count), recipes: recs }));
  }, [filteredByCategory]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems="flex-start"
      width="100%"
      className="flex flex-col md:flex-row gap-5 box-border max-w-[1450px] mx-auto text-lg px-4 py-8"
    >
      {/* Categories */}
      <div className="flex flex-row flex-wrap gap-4 overflow-x-auto w-full md:flex-col md:w-48">
        <CategoryList
          categories={categories}
          onSelectCategory={setSelectedCategoryId}
          selectedCategoryId={selectedCategoryId}
        />
      </div>

      {/* Recipe List */}
      <div className="w-full md:w-[530px]">
        <RecipeList
          groupedRecipes={groupedByMissingCount}
          selectedCategoryId={selectedCategoryId}
          onSelectRecipe={setSelectedRecipe}
          selectedRecipeId={selectedRecipe?.id ?? null}
        />
      </div>

      {/* Recipe Details */}
      <div className="w-full md:flex-1">
        <RecipeDetails recipe={selectedRecipe} />
      </div>
    </Stack>
  );
}
