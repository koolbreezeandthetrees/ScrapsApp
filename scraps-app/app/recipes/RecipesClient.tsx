"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { CategoryRecipe, FullRecipe, Ingredient, Unit } from "@/types/types";
import { RecipeForm } from "@/app/recipes/_components/RecipeForm/RecipeForm";
import { useRecipeForm } from "@/app/recipes/_components/RecipeForm/useRecipeForm";
import { getAllIngredients } from "@/app/actions/ingredients";
import { getUnitList } from "@/app/actions/common";
import { createRecipe } from "@/app/actions/recipes";
import { PenSquare } from "lucide-react";
import { CopyLinkButton } from "./_components/CopyLinkButton";

// Centralized Tailwind class strings for reuse
export const recipeStyles = {
  listsContainer: "px-4 py-8 flex flex-col md:flex-row gap-5 justify-start",
  categoryColumn:
    "flex flex-row flex-wrap gap-4 justify-start w-full md:flex-col md:w-48",
  categoryItem: "lowercase text-xl whitespace-nowrap hover:text-gray-200",
  categoryItemActive: "text-[#87756E] font-semibold",
  categoryItemInactive: "text-white",
  recipeItem: "lowercase text-xl whitespace-nowrap hover:text-gray-200",
  recipeItemActive: "text-[#87756E] font-semibold",
  recipeItemInactive: "text-white",
  recipeColumn:
    "w-full md:w-[530px] flex-shrink flex flex-col gap-2 border-t-2 border-white pt-4 md:pt-0 md:border-t-0 md:border-l-2 md:pl-8",
  detailColumn: "flex-1 relative flex flex-col gap-4",
  detailBorder:
    "border-t-2 border-white pt-4 md:pt-0 md:border-t-0 md:border-l-2 md:pl-8",
  detailItem: "flex flex-col gap-2",
  greyText: "text-[#e5dfdb] text-lg",
  missingIngredient: "text-[#BB5C4A] text-lg",
  greyList: "text-[#e5dfdb] text-lg",
  formContainer:
    "flex flex-col gap-5 rounded-lg bg-white/20 p-8 mt-8 w-full md:w-auto",
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
      {/* Top responsive layout */}
      <Stack
        direction="row"
        alignItems="flex-start"
        className={recipeStyles.listsContainer}
      >
        {/* Categories: horizontal scroll on mobile, vertical on md+ */}
        <Stack component="ul" className={recipeStyles.categoryColumn}>
          {categories.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedRecipe(null);
                  }}
                  className={`
                    ${recipeStyles.categoryItem} 
                    ${
                      isSelected
                        ? recipeStyles.categoryItemActive
                        : recipeStyles.categoryItemInactive
                    }
                  `}
                >
                  {cat.name}
                </button>
              </li>
            );
          })}
        </Stack>

        {/* Recipe list: full width on mobile, fixed on md+ */}
        <Stack component="div" className={recipeStyles.recipeColumn}>
          {selectedCategoryId == null ? (
            <Typography variant="h6">please select a category.</Typography>
          ) : filteredRecipes.length > 0 ? (
            <Stack component="ul" spacing={1}>
              {filteredRecipes.map((r) => {
                const isRecipeSelected = selectedRecipe?.id === r.id;
                return (
                  <li key={r.id}>
                    <button
                      onClick={() => setSelectedRecipe(r)}
                      className={`
            ${recipeStyles.recipeItem}
            ${
              isRecipeSelected
                ? recipeStyles.recipeItemActive
                : recipeStyles.recipeItemInactive
            }
          `}
                    >
                      {r.title}
                    </button>
                  </li>
                );
              })}
            </Stack>
          ) : (
            <Typography variant="h6" color="error">
              no recipes found for this category.
            </Typography>
          )}
        </Stack>

        {/* Details: stacked below list on mobile */}
        <Stack
          className={`${recipeStyles.detailColumn} ${
            selectedRecipe ? recipeStyles.detailBorder : ""
          } mt-8 md:mt-0`}
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
                className="mt-4 w-full object-cover h-auto"
              />

              <Box className="absolute top-4 right-4 flex items-center space-x-1 z-10">
                <CopyLinkButton recipeId={selectedRecipe.id} />
                <IconButton
                  onClick={() =>
                    router.push(`/recipes/${selectedRecipe.id}/edit`)
                  }
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "scale(1.1)",
                    },
                    transition: "transform 0.1s",
                  }}
                >
                  <PenSquare size={16} />
                </IconButton>
              </Box>
            </>
          )}
        </Stack>
      </Stack>

      {/* Add New Recipe Form */}
      {showAddForm && formReady && (
        <Box pb={6}>
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
        </Box>
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
