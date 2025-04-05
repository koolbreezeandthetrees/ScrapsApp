import { useState } from "react";
import { Ingredient, RecipeIngredient, Unit } from "@/types/types";

type RecipeFormData = {
  title: string;
  method: string;
  difficultyLevel: string;
  time: number;
  servings: number;
  categoryRecipeId: string;
};

type UseRecipeFormProps = {
  initialFormData?: RecipeFormData;
};

export function useRecipeForm({ initialFormData }: UseRecipeFormProps = {}) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: initialFormData?.title || "",
    method: initialFormData?.method || "",
    difficultyLevel: initialFormData?.difficultyLevel || "easy",
    time: initialFormData?.time || 10,
    servings: initialFormData?.servings || 1,
    categoryRecipeId: initialFormData?.categoryRecipeId || "",
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
      recipeId: 0,
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
