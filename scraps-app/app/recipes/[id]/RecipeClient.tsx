"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getRecipeById } from "@/app/actions";
import { FullRecipe } from "@/types/types";
import Stack from "@mui/material/Stack";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { PenSquare } from "lucide-react";
import { recipeStyles } from "../RecipesClient";
import { CopyLinkButton } from "../_components/CopyLinkButton";

export default function RecipeClient() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setError("Invalid recipe ID");
      return;
    }

    const recipeId = parseInt(id, 10);
    if (isNaN(recipeId)) {
      setError("Invalid recipe ID");
      return;
    }

    getRecipeById(recipeId)
      .then((data) => {
        if (data) {
          setRecipe(data);
        } else {
          setError("Recipe not found");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch recipe");
      });
  }, [id]);

  if (error)
    return (
      <Typography color="error" p={4}>
        {error}
      </Typography>
    );
  if (!recipe)
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
    <Box className="px-4 py-8">
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        className={recipeStyles.formContainer}
      >
        {/* Details Section */}
        <Stack className={recipeStyles.detailColumn} spacing={1}>
          <Typography variant="h4" className="uppercase text-white">
            {recipe.title}
          </Typography>

          {/* Method */}
          <Stack className={recipeStyles.detailItem}>
            <Typography variant="h6" className="text-white">
              Method:
            </Typography>
            <Typography className={recipeStyles.greyText}>
              {recipe.method}
            </Typography>
          </Stack>

          {/* Ingredients */}
          <Stack className={recipeStyles.detailItem}>
            <Typography variant="h6" className="text-white">
              Ingredients:
            </Typography>
            <ul className="list-none pl-0 space-y-0.5">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className={recipeStyles.greyList}>
                  {ing.quantityNeeded} {ing.unit.abbreviation}{" "}
                  {ing.ingredient.name}
                </li>
              ))}
            </ul>
          </Stack>

          {/* Category, Difficulty, Time, Servings */}
          {[
            { label: "Time", value: `${recipe.time} minutes` },
            { label: "Difficulty", value: recipe.difficultyLevel },
            { label: "Servings", value: recipe.servings },
            { label: "Category", value: recipe.category.name },
          ].map(({ label, value }) => (
            <Stack key={label} className={recipeStyles.detailItem}>
              <Typography variant="h6" className="text-white">
                {label}:
              </Typography>
              <Typography className={recipeStyles.greyText}>{value}</Typography>
            </Stack>
          ))}

          <Box flexShrink={0} width={{ xs: "100%", md: 400 }}>
            <Image
              src={recipe.image || "/placeholder-image.jpg"}
              alt={recipe.title}
              width={400}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </Box>

          <Box className="absolute top-4 right-4 flex items-center space-x-1 z-10">
            <CopyLinkButton recipeId={recipe.id} />
            <IconButton
              onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
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
        </Stack>
      </Stack>
    </Box>
  );
}
