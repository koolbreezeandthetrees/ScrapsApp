"use client";

import { useEffect, useState, useTransition, FormEvent } from "react";
import { useParams } from "next/navigation";
import {
  getIngredientById,
  updateIngredient,
  getUnitList,
  getColorList,
  getCategoryIngredientList,
} from "@/app/actions";
import { Ingredient, Unit, Color, CategoryIngredient } from "@/types/types";
import { SelectableRow } from "@/components/SelectableRow";
import {
  Box,
  CircularProgress,
  Typography,
  Stack,
  Button,
} from "@mui/material";

export default function IngredientEditPage() {
  const { id } = useParams();

  // Async + transition state
  const [isPending, startTransition] = useTransition();

  // Data collections
  const [options, setOptions] = useState<{
    units: Unit[];
    categories: CategoryIngredient[];
    colors: Color[];
  }>({ units: [], categories: [], colors: [] });

  // Current ingredient (for pre‑selects) & local form state
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    unit: Unit | null;
    color: Color | null;
    category: CategoryIngredient | null;
  }>({ name: "", unit: null, color: null, category: null });

  // UI status flags
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ───────────────────────── Fetch everything ─────────────────────────
  useEffect(() => {
    async function fetchAll() {
      if (!id || Array.isArray(id)) {
        setError("Invalid ingredient ID");
        setLoading(false);
        return;
      }

      const ingredientId = parseInt(id, 10);
      if (isNaN(ingredientId)) {
        setError("Invalid ingredient ID");
        setLoading(false);
        return;
      }

      try {
        const [ing, units, categories, colors] = await Promise.all([
          getIngredientById(ingredientId),
          getUnitList(),
          getCategoryIngredientList(),
          getColorList(),
        ]);

        if (!ing) {
          setError("Ingredient not found");
          setLoading(false);
          return;
        }

        setIngredient(ing);
        setOptions({ units, categories, colors });
        setFormData({
          name: ing.name,
          unit: units.find((u) => u.id === ing.unit.id) || null,
          color: colors.find((c) => c.id === ing.color.id) || null,
          category:
            categories.find((cat) => cat.id === ing.category.id) || null,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id]);

  // ───────────────────────── Handlers ─────────────────────────
  const handleTxtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !ingredient ||
      !formData.unit ||
      !formData.color ||
      !formData.category
    ) {
      alert("Please fill out all fields.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("unit", String(formData.unit.id));
    data.append("color", String(formData.color.id));
    data.append("category", String(formData.category.id));

    startTransition(() => {
      updateIngredient(ingredient.id, data); // server action redirects back to /ingredients
    });
  };

  // ───────────────────────── UI states ─────────────────────────
  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
      >
        <Typography color="error.main">{error}</Typography>
      </Box>
    );
  }

  if (!ingredient) return null;

  // ───────────────────────── Form layout (matches Add form) ─────────────────────────
  return (
    <Stack alignItems="center" justifyContent="start" minHeight="100vh" px={1}>
      <Stack
        sx={{
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.14)",
          p: 4,
          width: { xs: "100%", md: "90%" },
        }}
      >
        <Typography variant="h5" color="white">
          Edit ingredient
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack gap={2} mt={2}>
            <Typography variant="h6">Ingredient Name</Typography>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleTxtChange}
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

          {/* Actions */}
          <Stack direction="row" gap={2} justifyContent="flex-end" mt={4}>
            <Button variant="contained" color="info" type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}
