// app/recipes/RecipesClient.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { FullRecipe } from "@/types/types";
import AddRecipeForm from "./_components/AddRecipeForm";
import { CategoryRecipe } from "@/types/types";

interface RecipesClientProps {
  categories: CategoryRecipe[];
  recipes: FullRecipe[];
}

export default function RecipesClient({
  categories,
  recipes,
}: RecipesClientProps) {

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<FullRecipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter the recipes by the selected category
  const filteredRecipes = useMemo(() => {
    if (selectedCategoryId == null) return [];
    return recipes.filter((r) => r.category.id === selectedCategoryId);
  }, [selectedCategoryId, recipes]);
  // Handle category click
  function handleCategoryClick(catId: number) {
    setSelectedCategoryId(catId);
    setSelectedRecipe(null);
  }
  // Handle recipe click
  function handleRecipeClick(recipe: FullRecipe) {
    setSelectedRecipe(recipe);
  }
  // Toggle form
  function toggleAddForm() {
    setShowAddForm((prev) => !prev);
  }

  return (
    <div className="recipe-container-lists">
      {/* ====== Column 1: Categories ====== */}
      <div className="row-cat">
        <ul className="row-cat-list">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(cat.id);
                }}
                className="lowercase"
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ====== Column 2: Recipe List ====== */}
      <div className="row-recipe">
        <div id="recipe-list">
          {selectedCategoryId == null ? (
            <p>Please select a category.</p>
          ) : filteredRecipes.length > 0 ? (
            <ul>
              {filteredRecipes.map((r) => (
                <li key={r.id}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRecipeClick(r);
                    }}
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recipes found for this category.</p>
          )}
        </div>
      </div>

      {/* ====== Column 3: Recipe Details ====== */}
      <div className="row-detail">
        <div id="recipe-details" className="recipe-details">
          {selectedRecipe && (
            <>
              {/* Recipe title */}
              <h2 className="uppercase">{selectedRecipe.title}</h2>

              {/* Method */}
              <div className="details-item">
                <h3>Method:</h3>
                <p>{selectedRecipe.method}</p>
              </div>
              
              {/* Ingredients */}
              <div className="details-item">
                <h3>Ingredients:</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="grey-list">
                      {ing.quantityNeeded} {ing.unit.abbreviation}{" "}
                      {ing.ingredient.name}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Difficulty */}
              <div className="details-item">
                <h3>Difficulty:</h3>
                <p>{selectedRecipe.difficultyLevel}</p>
              </div>
                
              {/* Time */}
              <div className="details-item">
                <h3>Time:</h3>
                <p>{selectedRecipe.time} minutes</p>
              </div>
                
              {/* Servings */}
              <div className="details-item">
                <h3>Servings:</h3>
                <p>{selectedRecipe.servings}</p>
              </div>

              {/* <div className="details-item recipe-image">
                {selectedRecipe.image && (
                  <img
                    src={`/static/uploads/${selectedRecipe.image}`}
                    alt={`${selectedRecipe.title} Image`}
                  />
                )}
              </div> */}

              {/* Example "Edit" link with a pencil icon */}
              <div className="pencil-icon-container">
                <Image
                  src="/icons/edit.svg"
                  alt="Edit Recipe Icon"
                  width={15}
                  height={15}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ====== Add New Recipe Form (hidden by default) ====== */}
      <AddRecipeForm visible={showAddForm} />

      {/* Floating button to toggle form visibility */}
      <button
        id="toggle-form-btn"
        className="floating-btn"
        onClick={toggleAddForm}
      >
        + Add Recipe
      </button>
    </div>
  );
}
