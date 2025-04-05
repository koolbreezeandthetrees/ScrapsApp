import { FullRecipeWithMissingInfo } from "@/types/types";

type Props = {
  groupedRecipes: {
    missingCount: number;
    recipes: FullRecipeWithMissingInfo[];
  }[];
  selectedCategoryId: number | null;
  onSelectRecipe: (recipe: FullRecipeWithMissingInfo) => void;
};

export default function RecipeList({
  groupedRecipes,
  selectedCategoryId,
  onSelectRecipe,
}: Props) {
  if (selectedCategoryId === null) {
    return (
      <div className="row-recipe">
        <p>Please select a category.</p>
      </div>
    );
  }

  if (groupedRecipes.length === 0) {
    return (
      <div className="row-recipe">
        <p>No recipes found in this category.</p>
      </div>
    );
  }

  return (
    <div className="row-recipe">
      <div id="recipe-list">
        <h3 className="uppercase mb-4">Missing ingredients</h3>

        <div className="flex flex-col gap-6">
          {groupedRecipes.map((group) => (
            <div key={group.missingCount} className="flex items-start gap-5">
              <div className="text-xl font-mono w-6 text-right">
                {group.missingCount}
              </div>

              <div className="pl-2">
                <ul className="flex flex-col">
                  {group.recipes.map((r) => (
                    <li key={r.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectRecipe(r);
                        }}
                      >
                        {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
