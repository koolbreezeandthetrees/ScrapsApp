"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Unit, CategoryIngredient, Color } from "@/types/types";
import {
  createIngredient,
  getCategoryIngredientList,
  getColorList,
  getUnitList,
  getAllIngredientNames,
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
  }>({ units: [], categories: [], colors: [] });

  // existing ingredient names (lowercased)
  const [existingNames, setExistingNames] = useState<string[]>([]);

  const [formData, setFormData] = useState<{
    name: string;
    unit: Unit | null;
    color: Color | null;
    category: CategoryIngredient | null;
  }>({ name: "", unit: null, color: null, category: null });

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [units, categories, colors, names] = await Promise.all([
          getUnitList(),
          getCategoryIngredientList(),
          getColorList(),
          getAllIngredientNames(),
        ]);
        setOptions({ units, categories, colors });
        setExistingNames(names.map((n) => n.trim().toLowerCase()));
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

    const nameTrimmed = formData.name.trim();
    const nameLower = nameTrimmed.toLowerCase();

    // client-side duplicate guard
    if (existingNames.includes(nameLower)) {
      setSnackbar({
        open: true,
        message: "Ingredient already exists.",
        severity: "error",
      });
      return;
    }

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
      form.append("name", nameTrimmed);
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
      setFormData({ name: "", unit: null, color: null, category: null });

      // Delay navigation slightly to show the success snackbar
      setTimeout(() => router.push(`/inventory`), 1000);
    } catch (error: unknown) {
      console.error("Error adding ingredient:", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
      ) {
        if ((error as { message: string }).message === "DUPLICATE_NAME") {
          setSnackbar({
            open: true,
            message: "Ingredient already exists.",
            severity: "error",
          });
          return;
        }
      }
      setSnackbar({
        open: true,
        message: "Failed to add ingredient.",
        severity: "error",
      });
    }
  };

  const nameLower = formData.name.trim().toLowerCase();
  const isDuplicate = nameLower.length > 0 && existingNames.includes(nameLower);

  return (
    <>
      <Stack className={recipeStyles.formContainer}>
        <Typography variant="h5" className="text-white">
          Add new ingredient to database
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack gap={2} mt={2}>
            {/* Name input */}
            <Stack gap={1} mt={2}>
              <Typography variant="h6">Ingredient Name</Typography>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  borderColor: isDuplicate ? "red" : undefined,
                  borderWidth: isDuplicate ? 1 : undefined,
                  borderStyle: isDuplicate ? "solid" : undefined,
                }}
              />
              {isDuplicate && (
                <Typography variant="body2" color="error">
                  This ingredient already exists.
                </Typography>
              )}
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
                onSelect={(color) =>
                  setFormData((prev) => ({ ...prev, color }))
                }
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
              disabled={isDuplicate}
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
        onClose={(e, reason) =>
          reason !== "clickaway" &&
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
