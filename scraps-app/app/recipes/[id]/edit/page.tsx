"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateRecipe,
  updateRecipeIngredients,
  getRecipeById,
  getCategoryIngredientList,
  getUnitList,
  getAllIngredients,
} from "@/app/actions";
import {
  CategoryRecipe,
  Unit,
  Ingredient,
  RecipeIngredient,
  FullRecipe,
} from "@/types/types";

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const recipeId = parseInt(params.id, 10);

  // State
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [categories, setCategories] = useState<CategoryRecipe[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);

  const [formData, setFormData] = useState({
    title: "",
    method: "",
    difficultyLevel: "",
    time: "",
    servings: "",
    categoryRecipeId: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [recipeData, categoryData, unitData, ingredientData] =
          await Promise.all([
            getRecipeById(recipeId),
            getCategoryIngredientList(),
            getUnitList(),
            getAllIngredients(),
          ]);

        if (!recipeData) {
          console.error("Recipe not found!");
          return;
        }

        setRecipe(recipeData);
        setCategories(categoryData);
        setUnits(unitData);
        setIngredients(ingredientData);
        setRecipeIngredients(recipeData.ingredients);

        // Pre-fill the form data
        setFormData({
          title: recipeData.title,
          method: recipeData.method,
          difficultyLevel: recipeData.difficultyLevel,
          time: recipeData.time.toString(),
          servings: recipeData.servings.toString(),
          categoryRecipeId: recipeData.category.id.toString(),
        });
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    }
    fetchData();
  }, [recipeId]);

  // Handle form changes
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Add an ingredient
  function handleAddIngredient(
    ing: Ingredient,
    unitId: number,
    quantity: number
  ) {
    const foundUnit = units.find((u) => u.id === unitId);
    if (!foundUnit) {
      console.error("Unit not found:", unitId);
      return;
    }

    const newItem: RecipeIngredient = {
      id: Date.now(), // Temporary client ID
      recipeId,
      ingredient: ing,
      unit: foundUnit,
      quantityNeeded: quantity,
    };

    setRecipeIngredients((prev) => [...prev, newItem]);
  }

  // Remove an ingredient
  function handleRemoveIngredient(ingredientId: number) {
    setRecipeIngredients((prev) =>
      prev.filter((ri) => ri.ingredient.id !== ingredientId)
    );
  }

  // Submit the updated recipe
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await updateRecipe(recipeId, formData);
      await updateRecipeIngredients(recipeId, recipeIngredients);
      alert("Recipe updated successfully!");
      router.push(`/recipes/${recipeId}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe.");
    }
  }

  if (!recipe) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-recipe-form-container">
      <h2>Edit Recipe</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Difficulty */}
        <label htmlFor="difficultyLevel">Difficulty</label>
        <select
          name="difficultyLevel"
          value={formData.difficultyLevel}
          onChange={handleChange}
          required
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Time */}
        <label htmlFor="time">Time (minutes)</label>
        <input
          type="number"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        {/* Servings */}
        <label htmlFor="servings">Servings</label>
        <input
          type="number"
          name="servings"
          value={formData.servings}
          onChange={handleChange}
          required
        />

        {/* Method */}
        <label htmlFor="method">Method</label>
        <textarea
          name="method"
          value={formData.method}
          onChange={handleChange}
          required
        />

        {/* Category */}
        <label htmlFor="categoryRecipeId">Category</label>
        <select
          name="categoryRecipeId"
          value={formData.categoryRecipeId}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Current Ingredients */}
        <h3>Ingredients</h3>
        {recipeIngredients.length > 0 ? (
          <ul>
            {recipeIngredients.map((ri) => (
              <li key={ri.id}>
                {ri.quantityNeeded} {ri.unit.abbreviation} {ri.ingredient.name}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ri.ingredient.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients added.</p>
        )}

        {/* Add New Ingredient */}
        <div className="ingredient-add-section">
          <h4>Add Ingredient</h4>
          <select id="ingredientSelect">
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name}
              </option>
            ))}
          </select>

          <select id="unitSelect">
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.abbreviation}
              </option>
            ))}
          </select>

          <input type="number" id="quantityInput" placeholder="Quantity" />

          <button
            type="button"
            onClick={() => {
              const ingredientId = parseInt(
                (
                  document.getElementById(
                    "ingredientSelect"
                  ) as HTMLSelectElement
                ).value
              );
              const unitId = parseInt(
                (document.getElementById("unitSelect") as HTMLSelectElement)
                  .value
              );
              const quantity = parseFloat(
                (document.getElementById("quantityInput") as HTMLInputElement)
                  .value
              );

              const foundIng = ingredients.find(
                (ing) => ing.id === ingredientId
              );
              if (foundIng && unitId && quantity > 0) {
                handleAddIngredient(foundIng, unitId, quantity);
              }
            }}
          >
            Add
          </button>
        </div>

        {/* Submit */}
        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
}
