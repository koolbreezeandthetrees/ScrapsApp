"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getIngredientById } from "@/app/actions";
import { Ingredient } from "@/types/types";
import { Box, Stack, Typography, CircularProgress, Link, } from "@mui/material";
import { Settings } from "lucide-react";

export default function IngredientPage() {
  const { id } = useParams();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setError("Invalid ingredient ID");
      setLoading(false);
      return;
    }

    const ingredientId = parseInt(id);
    if (isNaN(ingredientId)) {
      setError("Invalid ingredient ID");
      setLoading(false);
      return;
    }

    getIngredientById(ingredientId)
      .then((data) => {
        if (data) {
          setIngredient(data);
        } else {
          setError("Ingredient not found");
        }
      })
      .catch(() => {
        setError("Failed to fetch ingredient");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
      >
        <Typography color="error.main">{error}</Typography>
      </Box>
    );
  }

  if (!ingredient) {
    return null;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="40vh"
      paddingX={1}
    >
      <Stack
        sx={{
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.14)",
          p: 4,
          width: { xs: "100%", md: "90%" },
        }}
      >
        <Stack gap={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" color="white">
              Ingredient Details
            </Typography>
            <Link href={`/ingredients/${ingredient.id}/edit`}>
              <Settings
                size={25}
                className="text-gray-400 hover:text-white"
              />
            </Link>
          </Stack>

          <Typography variant="h6" color="white">
            <strong>Name:</strong> {ingredient.name}
          </Typography>

          <Typography variant="h6" color="white">
            <strong>Unit:</strong> {ingredient.unit?.name} (
            {ingredient.unit?.abbreviation})
          </Typography>

          <Typography
            variant="h6"
            color="white"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <strong>Color:</strong> {ingredient.color?.name}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                backgroundColor: ingredient.color?.colorCode,
                width: 15,
                height: 15,
                borderRadius: "50%",
              }}
            />
          </Typography>

          <Typography variant="h6" color="white">
            <strong>Category:</strong> {ingredient.category?.name}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
