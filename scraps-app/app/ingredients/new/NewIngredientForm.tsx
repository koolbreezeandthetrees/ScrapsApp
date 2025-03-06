"use client";

import { SyntheticEvent, useState } from "react";
import { createIngredient } from "@/app/actions";
import Form from "next/form";
import SubmitButton from "@/components/SubmitButton";
import { CategoryIngredient, Color, Unit } from "@/types/types";

interface NewIngredientFormProps {
  units: Unit[];
  categories: CategoryIngredient[];
  colors: Color[];
}

export default function NewIngredientForm({
  units,
  categories,
  colors,
}: NewIngredientFormProps) {
  const [state, setState] = useState("ready");

  // Handle form submission
  async function handleOnSubmit(event: SyntheticEvent) {
    if (state === "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  }

  return (
    <Form action={createIngredient} onSubmit={handleOnSubmit}>
      <label>
        Name:
        <input type="text" name="name" required />
      </label>
      <label>
        Unit:
        <select name="unit" required>
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
        <select name="color" required>
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
        <select name="category" required>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <SubmitButton />
    </Form>
  );
}
