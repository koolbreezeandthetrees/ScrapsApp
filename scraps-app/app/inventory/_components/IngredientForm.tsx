"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUnitList,
  getCategoryIngredientList,
  getColorList,
  createIngredient,
} from "@/app/actions";
import { Unit, CategoryIngredient, Color } from "@/types/types"; // ✅ Import types

export default function IngredientForm() {
  const router = useRouter();

  // ✅ Use correct types from your types file
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
    unit: string;
    color: string;
    category: string;
  }>({
    name: "",
    unit: "",
    color: "",
    category: "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value)
      );

      const newIngredientId = await createIngredient(form);
      if (!newIngredientId) throw new Error("No ingredient ID returned");

      alert("Ingredient added successfully!");
      setFormData({ name: "", unit: "", color: "", category: "" });

      router.push(`/ingredients/${newIngredientId}`);
    } catch (error) {
      console.error("Error adding ingredient:", error);
      alert("Failed to add ingredient.");
    }
  };

  return (
    <div className="form-container" id="add-ingredient-form">
      <h3>Add New Ingredient</h3>
      <form onSubmit={handleSubmit}>
        {/* Ingredient Name */}
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

        {/* Unit Dropdown */}
        <Dropdown
          name="unit"
          label="Unit"
          value={formData.unit}
          onChange={handleChange}
          options={options.units}
        />

        {/* Color Dropdown */}
        <Dropdown
          name="color"
          label="Color"
          value={formData.color}
          onChange={handleChange}
          options={options.colors}
        />

        {/* Category Dropdown */}
        <Dropdown
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          options={options.categories}
        />

        {/* Submit Button */}
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

// ✅ Strongly Typed Reusable Dropdown Component
interface DropdownProps<T> {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: T[];
}

function Dropdown<T extends { id: number; name: string }>({
  name,
  label,
  value,
  onChange,
  options,
}: DropdownProps<T>) {
  return (
    <div className="form-input-item">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} value={value} onChange={onChange} required>
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
