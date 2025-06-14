import { recipeStyles } from "@/app/recipes/RecipesClient";
import { FullRecipeWithMissingInfo } from "@/types/types";
import { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

type Props = {
  groupedRecipes: {
    missingCount: number;
    recipes: FullRecipeWithMissingInfo[];
  }[];
  selectedCategoryId: number | null;
  onSelectRecipe: (recipe: FullRecipeWithMissingInfo) => void;
};

export default function RecipeList({
  groupedRecipes,
  selectedCategoryId,
  onSelectRecipe,
}: Props) {
  // Local delay state
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 900); // 500ms delay
    return () => clearTimeout(timer);
  }, []);

  // Show spinner until delay has passed
  if (!visible) return null; 

  // After delay, render normally
  if (selectedCategoryId === null) {
    return (
      <Stack component="div" className={recipeStyles.recipeColumn} spacing={2}>
        <Typography variant="h6">Please select a category.</Typography>
      </Stack>
    );
  }

  if (groupedRecipes.length === 0) {
    return (
      <Stack component="div" className={recipeStyles.recipeColumn} spacing={2}>
        <Typography variant="h6">
          No recipes found for this category.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack component="div" className={recipeStyles.recipeColumn} spacing={2}>
      <Typography variant="h6" className="uppercase mb-4">
        Missing ingredients
      </Typography>
      <Stack component="div" spacing={2}>
        {groupedRecipes.map((group) => (
          <div key={group.missingCount} className="flex items-start gap-5">
            <div className="text-xl font-mono w-6 text-right">
              {group.missingCount}
            </div>
            <Stack component="ul" spacing={1}>
              {group.recipes.map((r) => (
                <li key={r.id}>
                  <button
                    className="lowercase text-xl text-white hover:text-gray-200"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectRecipe(r);
                    }}
                  >
                    {r.title}
                  </button>
                </li>
              ))}
            </Stack>
          </div>
        ))}
      </Stack>
    </Stack>
  );
}
