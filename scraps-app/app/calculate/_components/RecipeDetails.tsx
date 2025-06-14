import { recipeStyles } from "@/app/recipes/RecipesClient";
import { FullRecipeWithMissingInfo } from "@/types/types";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";

type Props = {
  recipe: FullRecipeWithMissingInfo | null;
};

export default function RecipeDetails({ recipe }: Props) {
  if (!recipe) return <div className="row-detail" />;

  return (
    <Stack
      className={`${recipeStyles.detailColumn} ${recipeStyles.detailBorder}`}
    >
      <Typography variant="h4" className="uppercase text-white">
        {recipe.title}
      </Typography>

      <Stack className={recipeStyles.detailItem}>
        <Typography variant="h6" className="text-white">
          Method:
        </Typography>
        <Typography className={recipeStyles.greyText}>
          {recipe.method}
        </Typography>
      </Stack>

      <Stack className={recipeStyles.detailItem}>
        <Typography variant="h6" className="text-white">
          Ingredients:
        </Typography>
        <ul className="list-none pl-0 space-y-0.5">
          {recipe.ingredients.map((ing, idx) => (
            <li
              key={idx}
              className={
                ing.isMissing
                  ? recipeStyles.missingIngredient
                  : recipeStyles.greyList
              }
            >
              {ing.quantityNeeded} {ing.unit.abbreviation} {ing.ingredient.name}
            </li>
          ))}
        </ul>
      </Stack>

      {["Difficulty", "Time", "Servings"].map((label) => (
        <Stack key={label} className={recipeStyles.detailItem}>
          <Typography variant="h6" className="text-white">
            {label}:
          </Typography>
          <Typography className={recipeStyles.greyText}>
            {label === "Difficulty"
              ? recipe.difficultyLevel
              : label === "Time"
              ? `${recipe.time} minutes`
              : recipe.servings}
          </Typography>
        </Stack>
      ))}

      <Image
        src={recipe.image || "/placeholder-image.jpg"}
        alt="Recipe"
        height={400}
        width={400}
        className="mt-4"
      />
    </Stack>
  );
}
