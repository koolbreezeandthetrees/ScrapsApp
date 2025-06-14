import { recipeStyles } from "@/app/recipes/RecipesClient";
import { CategoryRecipe } from "@/types/types";
import { Stack } from "@mui/material";

type Props = {
  categories: CategoryRecipe[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
};

export default function CategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  return (
    <Stack component="ul" className={recipeStyles.categoryColumn}>
      {categories.map((cat) => (
        <li key={cat.id}>
          <button
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory(cat.id);
            }}
            className={`lowercase text-xl hover:text-gray-200 ${
              selectedCategoryId === cat.id ? "text-blue-500" : "text-white"
            }`}
          >
            {cat.name}
          </button>
        </li>
      ))}
    </Stack>
  );
}
