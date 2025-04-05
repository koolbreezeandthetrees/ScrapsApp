import React from "react";
import { Ingredient, Unit } from "@/types/types";

type Props = {
  ingredients: Ingredient[];
  units: Unit[];
  onAdd: (ingredientId: number, unitId: number, quantity: number) => void;
};

export function IngredientManager({ ingredients, units, onAdd }: Props) {
  return (
    <div className="ingredient-add-section">
      <h4>Add Ingredient</h4>
      <select id="ingredientSelect">
        {ingredients.map((ing) => (
          <option key={ing.id} value={ing.id}>
            {ing.name}
          </option>
        ))}
      </select>

      <select id="unitSelect">
        {units.map((u) => (
          <option key={u.id} value={u.id}>
            {u.abbreviation}
          </option>
        ))}
      </select>

      <input type="number" id="quantityInput" placeholder="Quantity" />

      <button
        type="button"
        onClick={() => {
          const ingredientId = parseInt(
            (document.getElementById("ingredientSelect") as HTMLSelectElement)
              .value
          );
          const unitId = parseInt(
            (document.getElementById("unitSelect") as HTMLSelectElement).value
          );
          const quantity = parseFloat(
            (document.getElementById("quantityInput") as HTMLInputElement).value
          );

          if (!isNaN(ingredientId) && !isNaN(unitId) && !isNaN(quantity)) {
            onAdd(ingredientId, unitId, quantity);
          }
        }}
      >
        Add
      </button>
    </div>
  );
}
