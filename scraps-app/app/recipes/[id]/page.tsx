import { getRecipeById } from "@/app/actions";
import { notFound } from "next/navigation";
import Image from "next/image";

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipeId = parseInt(params.id);

  if (isNaN(recipeId)) {
    throw new Error("Invalid recipe ID");
  }

  const recipe = await getRecipeById(recipeId);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>

        <Image
          src={recipe.image || "/placeholder-image.jpg"}
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
