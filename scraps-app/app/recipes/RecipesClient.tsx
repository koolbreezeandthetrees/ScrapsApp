"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CategoryRecipe, FullRecipe, Ingredient, Unit } from "@/types/types";

import { RecipeForm } from "@/app/recipes/_components/RecipeForm/RecipeForm";
import { useRecipeForm } from "@/app/recipes/_components/RecipeForm/useRecipeForm";
import { getAllIngredients } from "@/app/actions/ingredients";
import { getUnitList } from "@/app/actions/common";
import { createRecipe } from "@/app/actions/recipes";

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
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [allUnits, setAllUnits] = useState<Unit[]>([]);
  const [formReady, setFormReady] = useState(false);

  const {
    formData,
    setFormData,
    imageUrl,
    setImageUrl,
    recipeIngredients,
    handleAddIngredient,
    handleRemoveIngredient,
  } = useRecipeForm({
    initialFormData: {
      title: "",
      method: "",
      difficultyLevel: "easy",
      time: 5,
      servings: 1,
      categoryRecipeId: categories[0]?.id.toString() || "",
    },
  });

  useEffect(() => {
    async function fetchFormData() {
      const [ingredients, units] = await Promise.all([
        getAllIngredients(),
        getUnitList(),
      ]);
      setAllIngredients(ingredients);
      setAllUnits(units);
      setFormReady(true);
    }

    fetchFormData();
  }, []);

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

  async function handleCreateRecipe(e: React.FormEvent) {
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
      const result = await createRecipe(form, recipeIngredients);
      if (result?.success) {
        alert("Recipe created!");
        setShowAddForm(false);
        router.refresh(); // re-fetch server data
      } else {
        alert("Failed to create recipe.");
      }
    } catch (err) {
      console.error("Create error:", err);
      alert("Something went wrong.");
    }
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

                <Image
                  src={selectedRecipe.image || "/placeholder-image.jpg"}
                  alt="Recipe"
                  height={400}
                  width={400}
                />

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
      {showAddForm && formReady && (
        <div
          style={{ marginTop: "2rem" }}
          className="edit-recipe-form-container"
          id="recipe-form"
        >
          <h2>Add New Recipe</h2>
          <RecipeForm
            formData={formData}
            setFormData={setFormData}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            categories={categories}
            ingredients={allIngredients}
            units={allUnits}
            recipeIngredients={recipeIngredients}
            onAddIngredient={(ingredient, unitId, quantity) =>
              handleAddIngredient(ingredient, unitId, quantity, allUnits)
            }
            onRemoveIngredient={handleRemoveIngredient}
            onSubmit={handleCreateRecipe}
            submitLabel="Create Recipe"
          />
        </div>
      )}

      {/* Floating button to toggle form */}
      <button
        id="button"
        className="button floating-btn"
        onClick={toggleAddForm}
      >
        {showAddForm ? "Close" : "+ Add Recipe"}
      </button>
    </>
  );
}
