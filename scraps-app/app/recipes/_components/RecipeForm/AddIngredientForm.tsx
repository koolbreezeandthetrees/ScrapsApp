import React, { useState } from "react";
import { Ingredient, Unit } from "@/types/types";
import { SelectableRow } from "../../_components/SelectableRow";
import { Combobox } from "@headlessui/react";
import "./AddIngredientForm.css";

interface Props {
  ingredients: Ingredient[];
  units: Unit[];
  onAdd: (ingredientId: number, unitId: number, quantity: number) => void;
}

export default function AddIngredientForm({
  ingredients,
  units,
  onAdd,
}: Props) {
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [query, setQuery] = useState("");
  const [unitId, setUnitId] = useState<number>(units[0]?.id || 0);
  const [quantity, setQuantity] = useState<number>(1);

  const filteredIngredients =
    query === ""
      ? ingredients
      : ingredients.filter((ing) =>
          ing.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="ingredient-add-section">
      <h4 className="form-heading">Add Ingredient</h4>
      <div className="form-columns">
        {/* Left Column - Autocomplete */}
        <div className="form-column">
          <Combobox value={selectedIngredient} onChange={setSelectedIngredient}>
            <Combobox.Input
              onChange={(e) => setQuery(e.target.value)}
              displayValue={(ingredient: Ingredient) => ingredient?.name || ""}
              className="form-input"
              placeholder="Search ingredient..."
            />
            <Combobox.Options className="form-dropdown">
              {filteredIngredients.map((ingredient) => (
                <Combobox.Option
                  key={ingredient.id}
                  value={ingredient}
                  className={({ active }) =>
                    `form-option ${active ? "form-option-active" : ""}`
                  }
                >
                  {ingredient.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </div>

        {/* Right Column - Unit + Quantity */}
        <div className="form-column stacked">
          <div>
            <label className="form-label">Quantity</label>
            <SelectableRow
              name="quantity"
              options={[
                0.2, 0.33, 0.25, 0.5, 0.66, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
                95, 100, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
                750, 800, 850, 900, 950, 1000,
              ]}
              selected={quantity}
              onSelect={(value) => setQuantity(value)}
            />
          </div>
          <div>
            <label className="form-label">Unit</label>
            <SelectableRow
              name="unit"
              options={units}
              selected={units.find((u) => u.id === unitId) || units[0]}
              getLabel={(u) => u.abbreviation}
              getValue={(u) => u.id}
              onSelect={(unit) => setUnitId(unit.id)}
            />
          </div>

          <div className="add-button-wrapper">
            <button
              type="button"
              className="add-button-icon"
              onClick={() => {
                if (selectedIngredient && unitId && quantity > 0) {
                  onAdd(selectedIngredient.id, unitId, quantity);
                  setQuery("");
                  setSelectedIngredient(null);
                  setQuantity(1);
                }
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
