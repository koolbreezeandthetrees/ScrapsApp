import { FullRecipeWithMissingInfo } from "@/types/types";
import Image from "next/image";

type Props = {
  recipe: FullRecipeWithMissingInfo | null;
};

export default function RecipeDetails({ recipe }: Props) {
  if (!recipe) return <div className="row-detail" />;

  return (
    <div className="row-detail">
      <div className="recipe-details">
        <h2 className="uppercase">{recipe.title}</h2>

        <div className="details-item">
          <h3>Method:</h3>
          <p>{recipe.method}</p>
        </div>

        <div className="details-item">
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map((ing, idx) => (
              <li
                key={idx}
                className={ing.isMissing ? "missing-ingredient" : "grey-list"}
              >
                {ing.quantityNeeded} {ing.unit.abbreviation}{" "}
                {ing.ingredient.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="details-item">
          <h3>Difficulty:</h3>
          <p>{recipe.difficultyLevel}</p>
        </div>

        <div className="details-item">
          <h3>Time:</h3>
          <p>{recipe.time} minutes</p>
        </div>

        <div className="details-item">
          <h3>Servings:</h3>
          <p>{recipe.servings}</p>
        </div>

        <Image
          src={recipe.image || "/placeholder-image.jpg"}
          alt="Recipe"
          height={400}
          width={400}
        />
      </div>
    </div>
  );
}
