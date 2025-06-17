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
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Button, Snackbar, Alert } from "@mui/material";
import { recipeStyles } from "@/app/recipes/RecipesClient";

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

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
        setSnackbar({
          open: true,
          message: "Failed to load form options.",
          severity: "error",
        });
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
      setSnackbar({
        open: true,
        message: "Please fill out all fields.",
        severity: "error",
      });
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

      setSnackbar({
        open: true,
        message: "Ingredient added successfully!",
        severity: "success",
      });

      setFormData({
        name: "",
        unit: null,
        color: null,
        category: null,
      });

      // Delay navigation slightly to show the success snackbar
      setTimeout(() => router.push(`/inventory`), 1000);
    } catch (error) {
      console.error("Error adding ingredient:", error);
      setSnackbar({
        open: true,
        message: "Failed to add ingredient.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Stack className={recipeStyles.formContainer}>
        <Typography variant="h5" className="text-white">
          Add new ingredient to database
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack gap={2} mt={2}>
          {/* Name input */}
          <Stack gap={2} mt={2}>
            <Typography variant="h6">Ingredient Name</Typography>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Stack>

          {/* Unit */}
          <Stack gap={2} mt={2}>
            <Typography variant="h6">Unit</Typography>
            <SelectableRow
              name="unit"
              options={options.units}
              selected={formData.unit}
              onSelect={(unit) => setFormData((prev) => ({ ...prev, unit }))}
              getLabel={(u) => u.name}
              getValue={(u) => u.id}
            />
          </Stack>

          {/* Color */}
          <Stack gap={2} mt={2}>
            <Typography variant="h6">Color</Typography>
            <SelectableRow
              name="color"
              options={options.colors}
              selected={formData.color}
              onSelect={(color) => setFormData((prev) => ({ ...prev, color }))}
              getLabel={(c) => c.name}
              getValue={(c) => c.id}
            />
          </Stack>

          {/* Category */}
          <Stack gap={2} mt={2}>
            <Typography variant="h6">Category</Typography>
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
          </Stack>

          <Button
            type="submit"
            variant="text"
            color="info"
            sx={{ mt: 2, alignSelf: "center" }}
          >
            Submit
            </Button>
          </Stack>
        </form>
      </Stack>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          variant="filled"
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
