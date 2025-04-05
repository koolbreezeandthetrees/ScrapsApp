"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getRecipeById,
  updateRecipe,
  updateRecipeIngredients,
} from "@/app/actions/recipes";
import { getAllIngredients } from "@/app/actions/ingredients";
import { getAllRecipeCategories } from "@/app/actions/recipes";
import { getUnitList } from "@/app/actions/common";
import { Ingredient, Unit, CategoryRecipe, FullRecipe } from "@/types/types";
import { useRecipeForm } from "../../_components/RecipeForm/useRecipeForm";
import { RecipeForm } from "../../_components/RecipeForm/RecipeForm";

export default function EditRecipePage() {
  const { id } = useParams();
  const recipeId = parseInt(id as string, 10);
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryRecipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    formData,
    setFormData,
    imageUrl,
    setImageUrl,
    recipeIngredients,
    handleAddIngredient,
    handleRemoveIngredient,
  } = useRecipeForm({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [recipeData, catData, unitData, ingredientData] =
          await Promise.all([
            getRecipeById(recipeId),
            getAllRecipeCategories(),
            getUnitList(),
            getAllIngredients(),
          ]);

        if (!recipeData) {
          console.error("Recipe not found");
          return;
        }

        setFormData({
          title: recipeData.title,
          method: recipeData.method,
          difficultyLevel: recipeData.difficultyLevel,
          time: recipeData.time,
          servings: recipeData.servings,
          categoryRecipeId: recipeData.category.id.toString(),
        });
        setImageUrl(recipeData.image || "");
        setCategories(catData);
        setIngredients(ingredientData);
        setUnits(unitData);
        handleResetIngredients(recipeData.ingredients);
      } catch (err) {
        console.error("Failed to load recipe data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [recipeId]);

  function handleResetIngredients(ingList: FullRecipe["ingredients"]) {
    setTimeout(() => {
      ingList.forEach((ri) => {
        handleAddIngredient(
          ri.ingredient,
          ri.unit.id,
          ri.quantityNeeded,
          units
        );
      });
    }, 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("method", formData.method);
    form.append("difficultyLevel", formData.difficultyLevel);
    form.append("time", formData.time.toString());
    form.append("servings", formData.servings.toString());
    form.append("categoryRecipeId", formData.categoryRecipeId);
    form.append("image_url", imageUrl || "");

    try {
      await updateRecipe(recipeId, form);
      await updateRecipeIngredients(recipeId, recipeIngredients);
      alert("Recipe updated successfully!");
      router.push("/recipes");
    } catch (err) {
      console.error("Failed to update recipe", err);
      alert("Something went wrong.");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
       <div className="edit-recipe-form-container" id="recipe-form">
      <h2>Edit Recipe</h2>
      <RecipeForm
        formData={formData}
        setFormData={setFormData}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        categories={categories}
        ingredients={ingredients}
        units={units}
        recipeIngredients={recipeIngredients}
        onAddIngredient={(ingredient, unitId, quantity) =>
          handleAddIngredient(ingredient, unitId, quantity, units)
        }
        onRemoveIngredient={handleRemoveIngredient}
        onSubmit={handleSubmit}
        submitLabel="Update Recipe"
      />
    </div>
  );
}