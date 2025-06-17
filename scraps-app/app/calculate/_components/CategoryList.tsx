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
      {categories.map((cat) => {
        const isActive = selectedCategoryId === cat.id;
        return (
          <li key={cat.id}>
            <button
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(cat.id);
              }}
              className={`
                ${recipeStyles.categoryItem}
                ${
                  isActive
                    ? recipeStyles.categoryItemActive
                    : recipeStyles.categoryItemInactive
                }
              `}
            >
              {cat.name}
            </button>
          </li>
        );
      })}
    </Stack>
  );
}
