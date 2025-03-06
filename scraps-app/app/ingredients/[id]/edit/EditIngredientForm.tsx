"use client";

import { SyntheticEvent, useState, startTransition } from "react";
import { updateIngredient } from "@/app/actions";
import { NewIngredientFormProps } from "@/types/ingredient/ingredientTypes";
import SubmitButton from "@/components/SubmitButton";

interface EditIngredientFormProps extends NewIngredientFormProps {
  ingredient: {
    id: number;
    name: string;
    unitId: number;
    colorId: number;
    categoryIngredientId: number;
  };
}

export default function EditIngredientForm({
  ingredient,
  units,
  categories,
  colors,
}: EditIngredientFormProps) {
  const [state, setState] = useState("ready");

  async function handleOnSubmit(event: SyntheticEvent) {
    event.preventDefault();

    if (state === "pending") return;

    setState("pending");

    const formData = new FormData(event.target as HTMLFormElement);

    startTransition(() => {
      // Wrap updateIngredient to match expected action signature
      updateIngredient(ingredient.id, formData).finally(() =>
        setState("ready")
      );
    });
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          required
          defaultValue={ingredient.name}
        />
      </label>
      <label>
        Unit:
        <select name="unit" required defaultValue={ingredient.unitId}>
          <option value="">Select a unit</option>
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name} ({unit.abbreviation})
            </option>
          ))}
        </select>
      </label>
      <label>
        Color:
        <select name="color" required defaultValue={ingredient.colorId}>
          <option value="">Select a color</option>
          {colors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name} ({color.colorCode})
            </option>
          ))}
        </select>
      </label>
      <label>
        Category:
        <select
          name="category"
          required
          defaultValue={ingredient.categoryIngredientId}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <SubmitButton />
    </form>
  );
}
