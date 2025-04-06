import { getIngredientById } from "@/app/actions";
import { Ingredient } from "@/types/types";
import { notFound } from "next/navigation";

export default async function IngredientPage({
  params,
}: {
  params: { id: string };
}) {
  const ingredientId = parseInt(params.id);

  if (isNaN(ingredientId)) {
    throw new Error("Invalid ingredient ID");
  }

  const ingredient: Ingredient = await getIngredientById(ingredientId);

  if (!ingredient) {
    notFound();
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
