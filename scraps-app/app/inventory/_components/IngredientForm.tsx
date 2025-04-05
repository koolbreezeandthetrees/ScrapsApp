"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Unit, CategoryIngredient, Color } from "@/types/types";
import {
  createIngredient,
  getCategoryIngredientList,
  getColorList,
  getUnitList,
} from "@/app/actions";
import { SelectableRow } from "@/components/SelectableRow";

export default function IngredientForm() {
  const router = useRouter();

  const [options, setOptions] = useState<{
    units: Unit[];
    categories: CategoryIngredient[];
    colors: Color[];
  }>({
    units: [],
    categories: [],
    colors: [],
  });

  const [formData, setFormData] = useState<{
    name: string;
    unit: Unit | null;
    color: Color | null;
    category: CategoryIngredient | null;
  }>({
    name: "",
    unit: null,
    color: null,
    category: null,
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [units, categories, colors] = await Promise.all([
          getUnitList(),
          getCategoryIngredientList(),
          getColorList(),
        ]);
        setOptions({ units, categories, colors });
      } catch (error) {
        console.error("Error fetching form options:", error);
      }
    }
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.unit || !formData.color || !formData.category) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("unit", String(formData.unit.id));
      form.append("color", String(formData.color.id));
      form.append("category", String(formData.category.id));

      const newIngredientId = await createIngredient(form);
      if (!newIngredientId) throw new Error("No ingredient ID returned");

      alert("Ingredient added successfully!");
      setFormData({
        name: "",
        unit: null,
        color: null,
        category: null,
      });

      router.push(`/inventory`);
    } catch (error) {
      console.error("Error adding ingredient:", error);
      alert("Failed to add ingredient.");
    }
  };

  return (
    <div className="form-container" id="add-ingredient-form">
      <h2>Add new ingredient to database</h2>
      <form onSubmit={handleSubmit}>
        {/* Name input */}
        <div className="form-input-item">
          <label htmlFor="name">Ingredient Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Unit */}
        <div className="form-input-item">
          <label id="unit-label">Unit</label>
          <SelectableRow
            name="unit"
            options={options.units}
            selected={formData.unit}
            onSelect={(unit) => setFormData((prev) => ({ ...prev, unit }))}
            getLabel={(u) => u.name}
            getValue={(u) => u.id}
          />
        </div>

        {/* Color */}
        <div className="form-input-item">
          <label id="color-label">Color</label>
          <SelectableRow
            name="color"
            options={options.colors}
            selected={formData.color}
            onSelect={(color) => setFormData((prev) => ({ ...prev, color }))}
            getLabel={(c) => c.name}
            getValue={(c) => c.id}
          />
        </div>

        {/* Category */}
        <div className="form-input-item">
          <label id="category-label">Category</label>
          <SelectableRow
            name="category"
            options={options.categories}
            selected={formData.category}
            onSelect={(category) =>
              setFormData((prev) => ({ ...prev, category }))
            }
            getLabel={(c) => c.name}
            getValue={(c) => c.id}
          />
        </div>

        <button
          type="submit"
          className="button ing-form-submit-btn grow-element-normal"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
