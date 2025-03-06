// app/recipes/_components/AddRecipeForm.tsx
"use client";

import { FormEvent } from "react";
// If you want to call createRecipe as a server action:
import { createRecipe } from "../actions";

interface AddRecipeFormProps {
  visible: boolean;
}

export default function AddRecipeForm({ visible }: AddRecipeFormProps) {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Example of calling your server action directly:
    const result = await createRecipe(formData);

    if (result.success) {
      alert(`Recipe created with ID = ${result.recipeId}`);
      // You might want to refresh the page or close the form, etc.
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
        {/* Title Field */}
        <div className="form-input-item">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" required />
        </div>

        {/* Method Field */}
        <div className="form-input-item">
          <label htmlFor="method">Method</label>
          <textarea name="method" id="method" required />
        </div>

        {/* Category Field (from category_recipe) */}
        <div className="form-input-item">
          <label htmlFor="category_id" className="form-label">
            Category
          </label>
          <select name="category_id" id="category_id" required>
            <option value="" disabled selected>
              Select a category
            </option>
            {/* If you want to pass categories from the parent, do so and map them here */}
          </select>
        </div>

        <div className="form-input-item-horizontal">
          {/* Difficulty */}
          <div className="form-input-item">
            <label htmlFor="difficulty" className="form-label">
              Difficulty
            </label>
            <select name="difficulty" id="difficulty" required>
              <option value="" disabled selected>
                Select difficulty
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Servings */}
          <div className="form-input-item">
            <label htmlFor="servings" className="form-label">
              Servings
            </label>
            <select name="servings" id="servings" required>
              <option value="" disabled selected>
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
            <label htmlFor="time" className="form-label">
              Time (minutes)
            </label>
            <select className="form-control" name="time" id="time" required>
              <option value="" disabled selected>
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
          <label htmlFor="image" className="form-label">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control"
            name="image"
            id="image"
            accept="image/*"
          />
        </div>

        {/* Ingredients (Optional) */}
        <div id="ingredient-list">
          <div className="form-input-item">
            <label htmlFor="ingredients" className="form-label">
              Ingredient
            </label>
            <div className="form-input-item-horizontal">
              <div className="form-input-item">
                <label htmlFor="ingredients" className="form-label">
                  Ingredients
                </label>
                <select name="ingredients[]" required>
                  <option value="" disabled selected>
                    Select an ingredient
                  </option>
                  {/* If you want to pass an ingredient list as props, map it here */}
                </select>
              </div>

              <div className="form-input-item">
                <label htmlFor="quantities" className="form-label">
                  Quantity
                </label>
                <select name="quantities[]" required>
                  <option value="1">1</option>
                  <option value="0.25">1/4</option>
                  <option value="0.5">1/2</option>
                  <option value="1.5">1 1/2</option>
                  <option value="2">2</option>
                </select>
              </div>

              <div className="form-input-item">
                <label htmlFor="units" className="form-label">
                  Unit
                </label>
                <select name="units[]" required>
                  <option value="" disabled selected>
                    Select a unit
                  </option>
                  {/* Similarly, map your units here if you'd like */}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* + Add Another Ingredient Button */}
        <div className="button-container">
          <button
            type="button"
            id="add-ingredient"
            className="float-right small-btn grow-element-slow"
            onClick={() => {
              alert("TODO: Implement dynamic fields in React!");
            }}
          >
            + Add Another Ingredient
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="button">
          + Add Recipe
        </button>
      </form>
    </div>
  );
}
