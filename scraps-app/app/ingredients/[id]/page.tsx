"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getIngredientById } from "@/app/actions";
import { Ingredient } from "@/types/types";

export default function IngredientPage() {
  const { id } = useParams();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setError("Invalid ingredient ID");
      return;
    }

    const ingredientId = parseInt(id);
    if (isNaN(ingredientId)) {
      setError("Invalid ingredient ID");
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
      });
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!ingredient) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Ingredient Details</h1>
      <p>
        <strong>Name:</strong> {ingredient.name}
      </p>
      <p>
        <strong>Unit:</strong> {ingredient.unit?.name} (
        {ingredient.unit?.abbreviation})
      </p>
      <p>
        <strong>Color:</strong> {ingredient.color?.name}{" "}
        <span
          style={{
            display: "inline-block",
            backgroundColor: ingredient.color?.colorCode,
            width: "20px",
            height: "20px",
            borderRadius: "50%",
          }}
        ></span>
      </p>
      <p>
        <strong>Category:</strong> {ingredient.category?.name}
      </p>
    </div>
  );
}
