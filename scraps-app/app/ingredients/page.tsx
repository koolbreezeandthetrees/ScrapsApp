import { getIngredientsByCategory } from "@/app/actions/ingredients";
import Link from "next/link";
import { Settings } from "lucide-react";

export default async function IngredientsListPage() {
  const ingredients = await getIngredientsByCategory();

  // Organize ingredients by category
  const groupedIngredients = ingredients.reduce((acc, item) => {
    const categoryName = item.categoryName ?? "Unknown"; // Handle null category names
    if (!acc[categoryName]) {
      acc[categoryName] = []; // Initialize the category group
    }
    acc[categoryName].push(item); // Add the ingredient to the appropriate category
    return acc;
  }, {} as Record<string, typeof ingredients>);

  return (
    <div
      className="flex align-middle justify-center gap-8"
      style={{ margin: "40px" }}
    >
      <h1>Ingredients</h1>
      <div style={{ display: "flex", gap: 1 }}>
        {Object.entries(groupedIngredients).map(
          ([categoryName, ingredients]) => (
            <div
              key={categoryName}
              style={{ flex: "1 1 300px", maxWidth: "300px" }}
            >
              <h2>{categoryName}</h2>
              <ul>
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient.ingredientId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      maxWidth: "200px",
                    }}
                  >
                    <span>{ingredient.ingredientName}</span>
                    <Link href={`/ingredients/${ingredient.ingredientId}/edit`}>
                      <span>
                        <Settings size={16} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
}
