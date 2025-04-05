import { useState } from "react";
import { Ingredient, RecipeIngredient, Unit } from "@/types/types";

export function useRecipeForm(initialValues: {
  title?: string;
  method?: string;
  difficultyLevel?: string;
  time?: number;
  servings?: number;
  categoryRecipeId?: string;
}) {
  const [formData, setFormData] = useState({
    title: initialValues.title || "",
    method: initialValues.method || "",
    difficultyLevel: initialValues.difficultyLevel || "Easy",
    time: initialValues.time || 10,
    servings: initialValues.servings || 1,
    categoryRecipeId: initialValues.categoryRecipeId || "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);

  const handleAddIngredient = (
    ingredient: Ingredient,
    unitId: number,
    quantity: number,
    units: Unit[]
  ) => {
    const foundUnit = units.find((u) => u.id === unitId);
    if (!foundUnit) return;

    const newItem: RecipeIngredient = {
      id: Date.now(),
      recipeId: 0, // will be replaced on submit if needed
      ingredient,
      unit: foundUnit,
      quantityNeeded: quantity,
    };
    setRecipeIngredients((prev) => [...prev, newItem]);
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    setRecipeIngredients((prev) =>
      prev.filter((ri) => ri.ingredient.id !== ingredientId)
    );
  };

  return {
    formData,
    setFormData,
    imageUrl,
    setImageUrl,
    recipeIngredients,
    handleAddIngredient,
    handleRemoveIngredient,
  };
}
