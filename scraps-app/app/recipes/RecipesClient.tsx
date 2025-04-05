"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddRecipeForm from "@/app/recipes/_components/AddRecipeForm";
import { CategoryRecipe, FullRecipe } from "@/types/types";

interface RecipesClientProps {
  categories: CategoryRecipe[];
  recipes: FullRecipe[];
}

export default function RecipesClient({
  categories,
  recipes,
}: RecipesClientProps) {
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] = useState<FullRecipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter recipes by selected category
  const filteredRecipes = useMemo(() => {
    if (selectedCategoryId == null) return [];
    return recipes.filter((r) => r.category.id === selectedCategoryId);
  }, [selectedCategoryId, recipes]);

  function handleCategoryClick(catId: number) {
    setSelectedCategoryId(catId);
    setSelectedRecipe(null);
  }

  function handleRecipeClick(recipe: FullRecipe) {
    setSelectedRecipe(recipe);
  }

  function handleEditClick(recipeId: number) {
    router.push(`/recipes/${recipeId}/edit`);
  }

  function toggleAddForm() {
    setShowAddForm((prev) => !prev);
  }

  return (
    <>
      {/* ===== Three-column layout at the top ===== */}
      <div className="recipe-container-lists">
        {/* Column 1: Categories */}
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

        {/* Column 2: Recipe List */}
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

        {/* Column 3: Recipe Details */}
        <div className="row-detail">
          <div id="recipe-details" className="recipe-details">
            {selectedRecipe && (
              <>
                <h2 className="uppercase">{selectedRecipe.title}</h2>

                <div className="details-item">
                  <h3>Method:</h3>
                  <p>{selectedRecipe.method}</p>
                </div>

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

                <div className="details-item">
                  <h3>Difficulty:</h3>
                  <p>{selectedRecipe.difficultyLevel}</p>
                </div>

                <div className="details-item">
                  <h3>Time:</h3>
                  <p>{selectedRecipe.time} minutes</p>
                </div>

                <div className="details-item">
                  <h3>Servings:</h3>
                  <p>{selectedRecipe.servings}</p>
                </div>

                <Image src={selectedRecipe.image || "/placeholder-image.jpg"} alt="Recipe" height={400} width={400}/>

                {/* Edit icon => go to Edit page */}
                <div
                  className="pencil-icon-container clickable"
                  onClick={() => handleEditClick(selectedRecipe.id)}
                >
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
      </div>

      {/* ===== Add New Recipe Form is rendered at the bottom ===== */}
      <div style={{ marginTop: "2rem" }}>
        <AddRecipeForm visible={showAddForm} />
      </div>

      {/* Floating button to toggle form */}
      <button
        id="toggle-form-btn"
        className="floating-btn"
        onClick={toggleAddForm}
      >
        {showAddForm ? "Close" : "+ Add Recipe"}
      </button>
    </>
  );
}
