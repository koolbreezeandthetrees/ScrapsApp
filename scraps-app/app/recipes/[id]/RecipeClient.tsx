"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getRecipeById } from "@/app/actions";
import { FullRecipe } from "@/types/types";

export default function RecipeClient() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) {
      setError("Invalid recipe ID");
      return;
    }

    const recipeId = parseInt(id);
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

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!recipe) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>

        <Image
          src={recipe.image || "/placeholder-image.png"}
          alt={recipe.title}
          width={800} // Adjust width as needed
          height={600} // Adjust height as needed
          className="w-full h-auto mb-4 rounded-xl shadow"
        />

      <div className="text-sm text-gray-500 mb-6">
        <p>
          <strong>Category:</strong> {recipe.category.name}
        </p>
        <p>
          <strong>Difficulty:</strong> {recipe.difficultyLevel}
        </p>
        <p>
          <strong>Time:</strong> {recipe.time} minutes
        </p>
        <p>
          <strong>Servings:</strong> {recipe.servings}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
      <ul className="mb-6 list-disc list-inside">
        {recipe.ingredients.map((ri) => (
          <li key={ri.id}>
            {ri.quantityNeeded} {ri.unit.abbreviation} {ri.ingredient.name}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Method</h2>
      <p className="whitespace-pre-line">{recipe.method}</p>
    </div>
  );
}
