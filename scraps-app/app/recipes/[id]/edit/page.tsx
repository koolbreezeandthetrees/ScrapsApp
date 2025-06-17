"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getRecipeById,
  updateRecipe,
  updateRecipeIngredients,
} from "@/app/actions/recipes";
import { getAllIngredients } from "@/app/actions/ingredients";
import { getAllRecipeCategories } from "@/app/actions/recipes";
import { getUnitList } from "@/app/actions/common";
import { Ingredient, Unit, CategoryRecipe } from "@/types/types";
import { useRecipeForm } from "@/app/recipes/_components/RecipeForm/useRecipeForm";
import { RecipeForm } from "@/app/recipes/_components/RecipeForm/RecipeForm";
import {
  Box,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  AlertColor,
  Stack,
} from "@mui/material";

export default function EditRecipePage() {
  const { id } = useParams();
  const recipeId = parseInt(id as string, 10);
  const router = useRouter();

  const [categories, setCategories] = useState<CategoryRecipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  // Snackbar state
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message: string, severity: AlertColor = "success") => {
    setSnack({ open: true, message, severity });
  };
  const handleSnackClose = () => setSnack((prev) => ({ ...prev, open: false }));

  // Ref to guard against React StrictMode / Fast Refresh double-run
  const hasSeeded = useRef(false);

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
      time: 0,
      servings: 0,
      categoryRecipeId: "",
    },
  });

  useEffect(() => {
    if (hasSeeded.current) return;
    hasSeeded.current = true;

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
          showSnack("Recipe not found", "error");
          setLoading(false);
          return;
        }

        // Populate form fields
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

        // Seed ingredients exactly once
        recipeData.ingredients.forEach((ri) => {
          handleAddIngredient(
            ri.ingredient,
            ri.unit.id,
            ri.quantityNeeded,
            unitData
          );
        });
      } catch (err) {
        console.error("Failed to load recipe data", err);
        showSnack("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [recipeId, setFormData, setImageUrl, handleAddIngredient]);

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
      showSnack("Recipe updated successfully!", "success");
      setTimeout(() => router.push("/recipes"), 800);
    } catch (err) {
      console.error("Failed to update recipe", err);
      showSnack("Something went wrong", "error");
    }
  }

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Stack
        spacing={4}
        borderRadius={2}
        padding={4}
        margin="0 auto"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.14)" }}
      >
        <Typography variant="h4" className="uppercase text-white">
          Edit Recipe
        </Typography>
        <RecipeForm
          formData={formData}
          setFormData={setFormData}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          categories={categories}
          ingredients={ingredients}
          units={units}
          recipeIngredients={recipeIngredients}
          onAddIngredient={(ing, uid, qty) =>
            handleAddIngredient(ing, uid, qty, units)
          }
          onRemoveIngredient={handleRemoveIngredient}
          onSubmit={handleSubmit}
          submitLabel="Update Recipe"
        />
      </Stack>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={handleSnackClose}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
