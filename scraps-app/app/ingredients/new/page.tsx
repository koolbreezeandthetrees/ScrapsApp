import {
  getUnitList,
  getCategoryIngredientList,
  getColorList,
} from "@/app/actions";
import NewIngredientForm from "./NewIngredientForm";
import { CategoryIngredient, Color, Unit } from "@/types/types";

export default async function CreateIngredientPage() {
  // Fetch data from the database
  const units: Unit[] = await getUnitList();
  const categories: CategoryIngredient[] = await getCategoryIngredientList();
  const colors: Color[] = await getColorList();

  return (
    <div>
      <h1>Create New Ingredient</h1>
      <NewIngredientForm
        units={units}
        categories={categories}
        colors={colors}
      />
    </div>
  );
}
