"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import { Button, IconButton, Typography } from "@mui/material";
import { CategoryRecipe, FullRecipe, Ingredient, Unit } from "@/types/types";
import { RecipeForm } from "@/app/recipes/_components/RecipeForm/RecipeForm";
import { useRecipeForm } from "@/app/recipes/_components/RecipeForm/useRecipeForm";
import { getAllIngredients } from "@/app/actions/ingredients";
import { getUnitList } from "@/app/actions/common";
import { createRecipe } from "@/app/actions/recipes";
import { PenSquare } from "lucide-react";

// Centralized Tailwind class strings for reuse
export const recipeStyles = {
  listsContainer: "px-4 py-8 flex gap-5 justify-start",
  categoryColumn: "flex flex-col gap-4 w-48",
  // Always show border between categories and recipes
  recipeColumn:
    "w-[530px] flex-shrink flex flex-col gap-2 border-l-2 border-white pl-8",
  detailColumn: "flex-1 relative flex flex-col gap-4 pl-8",
  detailBorder: "border-l-2 border-white",
  detailItem: "flex flex-col gap-2",
  greyText: "text-[#e5dfdb] text-lg",
  missingIngredient: "text-[#BB5C4A] text-lg",
  greyList: "text-[#e5dfdb] text-lg",
  formContainer: "flex flex-col gap-5 rounded-lg bg-white/20 p-8 mt-8",
};

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

  const toggleAddForm = () => setShowAddForm((prev) => !prev);

  const handleCreateRecipe = async (e: React.FormEvent) => {
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
        router.refresh();
      } else {
        alert("Failed to create recipe.");
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  return (
    <>
      {/* Top three-column layout */}
      <Stack
        direction="row"
        alignItems="flex-start"
        className={recipeStyles.listsContainer}
      >
        {/* Column 1: Categories */}
        <Stack component="ul" className={recipeStyles.categoryColumn}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setSelectedRecipe(null);
                }}
                className="lowercase text-xl text-white hover:text-gray-200"
              >
                {cat.name}
              </button>
            </li>
          ))}
        </Stack>

        {/* Column 2: Recipe List */}
        <Stack component="div" className={recipeStyles.recipeColumn}>

          {selectedCategoryId == null ? (
            <Typography variant="h6">Please select a category.</Typography>

          ) : filteredRecipes.length > 0 ? (
            <Stack component="ul" spacing={1}>
              {filteredRecipes.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setSelectedRecipe(r)}
                    className="lowercase text-xl text-white hover:text-gray-200"
                  >
                    {r.title}
                  </button>
                </li>
              ))}
            </Stack>
          ) : (
            <Typography variant="h6">No recipes found for this category.</Typography>
          )}
        </Stack>

        {/* Column 3: Recipe Details */}
        <Stack
          className={`${recipeStyles.detailColumn} ${
            selectedRecipe ? recipeStyles.detailBorder : ""
          }`}
        >
          {selectedRecipe && (
            <>
              <Typography variant="h4" className="uppercase text-white">
                {selectedRecipe.title}
              </Typography>

              {/* Method */}
              <Stack className={recipeStyles.detailItem}>
                <Typography variant="h6" className="text-white">
                  Method:
                </Typography>
                <Typography className={recipeStyles.greyText}>
                  {selectedRecipe.method}
                </Typography>
              </Stack>

              {/* Ingredients */}
              <Stack className={recipeStyles.detailItem}>
                <Typography variant="h6" className="text-white">
                  Ingredients:
                </Typography>
                <ul className="list-none pl-0 space-y-0.5">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx} className={recipeStyles.greyList}>
                      {ing.quantityNeeded} {ing.unit.abbreviation}{" "}
                      {ing.ingredient.name}
                    </li>
                  ))}
                </ul>
              </Stack>

              {/* Difficulty, Time, Servings */}
              {["Difficulty", "Time", "Servings"].map((label) => (
                <Stack key={label} className={recipeStyles.detailItem}>
                  <Typography variant="h6" className="text-white">
                    {label}:
                  </Typography>
                  <Typography className={recipeStyles.greyText}>
                    {label === "Difficulty"
                      ? selectedRecipe.difficultyLevel
                      : label === "Time"
                      ? `${selectedRecipe.time} minutes`
                      : selectedRecipe.servings}
                  </Typography>
                </Stack>
              ))}

              {/* Image */}
              <Image
                src={selectedRecipe.image || "/placeholder-image.jpg"}
                alt="Recipe image"
                width={400}
                height={400}
                className="mt-4"
              />

              {/* Edit button */}
              <IconButton
                onClick={() =>
                  router.push(`/recipes/${selectedRecipe.id}/edit`)
                }
                className="absolute top-2 right-2 z-10 hover:scale-110 transition-transform"
                size="small"
              >
                <PenSquare size={16} className="text-white" />
              </IconButton>
            </>
          )}
        </Stack>
      </Stack>

      {/* Add New Recipe Form */}
      {showAddForm && formReady && (
        <Stack
          onSubmit={handleCreateRecipe}
          className={recipeStyles.formContainer}
        >
          <Typography variant="h5" className="text-white">
            Add New Recipe
          </Typography>
          <RecipeForm
            formData={formData}
            setFormData={setFormData}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            categories={categories}
            ingredients={allIngredients}
            units={allUnits}
            recipeIngredients={recipeIngredients}
            onSubmit={handleCreateRecipe}
            onAddIngredient={(ing, uid, qty) =>
              handleAddIngredient(ing, uid, qty, allUnits)
            }
            onRemoveIngredient={handleRemoveIngredient}
            submitLabel="Create Recipe"
          />
        </Stack>
      )}

      <Button
        variant="contained"
        color="info"
        onClick={toggleAddForm}
        sx={{
          position: "fixed",
          bottom: "50px",
          right: "70px",
          zIndex: 1000,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        {showAddForm ? "Close" : "+ Add Recipe"}
      </Button>
    </>
  );
}

