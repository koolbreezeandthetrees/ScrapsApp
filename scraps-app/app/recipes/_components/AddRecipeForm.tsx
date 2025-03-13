"use client";

import { FormEvent } from "react";
import { createRecipe } from "@/app/actions/recipes";

interface AddRecipeFormProps {
  visible: boolean;
}

export default function AddRecipeForm({ visible }: AddRecipeFormProps) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await createRecipe(formData);

    if (result?.success) {
      alert(`Recipe created with ID = ${result.recipeId}`);
      // Possibly refresh the page or hide the form
    } else {
      alert("Failed to create recipe.");
    }
  }

  return (
    <div
      id="add-recipe-form"
      className="form-container"
      style={{ display: visible ? "block" : "none" }}
    >
      <h3>Add New Recipe</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Title */}
        <div className="form-input-item">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" required />
        </div>

        {/* Method */}
        <div className="form-input-item">
          <label htmlFor="method">Method</label>
          <textarea name="method" id="method" required />
        </div>

        {/* Category */}
        <div className="form-input-item">
          <label htmlFor="category_id">Category</label>
          <select name="category_id" id="category_id" required defaultValue="">
            <option value="" disabled>
              Select a category
            </option>
            {/* TODO: pass real categories as props and .map them */}
          </select>
        </div>

        <div className="form-input-item-horizontal">
          {/* Difficulty */}
          <div className="form-input-item">
            <label htmlFor="difficulty">Difficulty</label>
            <select name="difficulty" id="difficulty" required defaultValue="">
              <option value="" disabled>
                Select difficulty
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Servings */}
          <div className="form-input-item">
            <label htmlFor="servings">Servings</label>
            <select name="servings" id="servings" required defaultValue="">
              <option value="" disabled>
                Select servings
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div className="form-input-item">
            <label htmlFor="time">Time (minutes)</label>
            <select name="time" id="time" required defaultValue="">
              <option value="" disabled>
                Select time
              </option>
              {[1, 5, 10, 15, 30, 60, 90, 120].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-input-item">
          <label htmlFor="image">Upload Image</label>
          <input type="file" name="image" id="image" accept="image/*" />
        </div>

        {/* Ingredients (optional, not handled in createRecipe yet) */}
        <div id="ingredient-list">
          <label>Ingredients (Optional)</label>
          {/* 
             If you want to actually store these, 
             read them in createRecipe (using formData.getAll("ingredients[]"))
             and do inserts into `recipeIngredient`.
          */}
          <select name="ingredients[]" required defaultValue="">
            <option value="" disabled>
              Select an ingredient
            </option>
            {/* TODO: map real ingredients here */}
          </select>

          <select name="quantities[]" required defaultValue="">
            <option value="1">1</option>
            <option value="0.25">1/4</option>
            <option value="0.5">1/2</option>
          </select>

          <select name="units[]" required defaultValue="">
            <option value="" disabled>
              Select a unit
            </option>
            {/* TODO: map real units here */}
          </select>
        </div>

        {/* + Add Another Ingredient Button */}
        <button
          type="button"
          onClick={() => alert("Implement dynamic fields in React if needed")}
        >
          + Add Another Ingredient
        </button>

        {/* Submit */}
        <button type="submit" className="button">
          + Add Recipe
        </button>
      </form>
    </div>
  );
}
