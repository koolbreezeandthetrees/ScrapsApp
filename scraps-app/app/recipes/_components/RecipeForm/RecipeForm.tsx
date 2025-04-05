import React from "react";
import Image from "next/image";
import { UploadButton } from "@/app/api/uploadthing/uploadthing";
import { SelectableRow } from "../../_components/SelectableRow";
import {
  CategoryRecipe,
  Ingredient,
  RecipeIngredient,
  Unit,
} from "@/types/types";
import AddIngredientForm from "./AddIngredientForm";
import { IconButton, List, ListItem, Stack } from "@mui/material"; 
import CloseIcon from "@mui/icons-material/Close";

type RecipeFormProps = {
  formData: {
    title: string;
    method: string;
    difficultyLevel: string;
    time: number;
    servings: number;
    categoryRecipeId: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<RecipeFormProps["formData"]>
  >;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  categories: CategoryRecipe[];
  ingredients: Ingredient[];
  units: Unit[];
  recipeIngredients: RecipeIngredient[];
  onRemoveIngredient: (ingredientId: number) => void;
  onAddIngredient: (
    ingredient: Ingredient,
    unitId: number,
    quantity: number
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
};

export function RecipeForm({
  formData,
  setFormData,
  imageUrl,
  setImageUrl,
  categories,
  ingredients,
  units,
  recipeIngredients,
  onAddIngredient,
  onRemoveIngredient,
  onSubmit,
  submitLabel,
}: RecipeFormProps) {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "time" || name === "servings" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
      <div className="form-input-container">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="difficultyLevel">Difficulty</label>
        <SelectableRow
          name="difficultyLevel"
          options={["easy", "medium", "hard"]}
          selected={formData.difficultyLevel}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, difficultyLevel: value }))
          }
        />

        <label htmlFor="time">Time (minutes)</label>
        <SelectableRow
          name="time"
          options={[5, 10, 15, 20, 30, 35, 40, 45, 50, 55, 60]}
          selected={formData.time}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, time: value }))
          }
        />

        <label htmlFor="servings">Servings</label>
        <SelectableRow
          name="servings"
          options={[1, 2, 3, 4, 5, 6, 7, 8]}
          selected={formData.servings}
          onSelect={(value) =>
            setFormData((prev) => ({ ...prev, servings: value }))
          }
        />

        <label htmlFor="method">Method</label>
        <textarea
          name="method"
          value={formData.method}
          onChange={handleChange}
          required
          rows={12}
        />

        <label htmlFor="categoryRecipeId">Category</label>
        <SelectableRow
          name="categoryRecipeId"
          options={categories}
          selected={
            categories.find(
              (cat) => cat.id.toString() === formData.categoryRecipeId
            ) ?? categories[0]
          }
          getLabel={(cat) => cat.name}
          getValue={(cat) => cat.id}
          onSelect={(cat) =>
            setFormData((prev) => ({
              ...prev,
              categoryRecipeId: cat.id.toString(),
            }))
          }
        />
        <label>Ingredients</label>
        {recipeIngredients.length > 0 ? (
          <List>
            {recipeIngredients.map((ri) => (
              <ListItem
                key={`recipe-ing${ri.ingredient.id}-${ri.unit.id}`}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pl: 4,
                  pr: 0,
                  py: 0.2,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px", // optional: rounded corners
                  },
                }}
              >
                <span>
                  {ri.quantityNeeded} {ri.unit.abbreviation}{" "}
                  {ri.ingredient.name}
                </span>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemoveIngredient(ri.ingredient.id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <p>No ingredients added.</p>
        )}
        <AddIngredientForm
          ingredients={ingredients}
          units={units}
          onAdd={(ingredientId, unitId, quantity) => {
            const foundIng = ingredients.find((i) => i.id === ingredientId);
            if (foundIng) {
              onAddIngredient(foundIng, unitId, quantity);
            }
          }}
        />

        <label htmlFor="image_url">Image</label>
        <Stack alignItems="start">
          <input type="hidden" name="image_url" value={imageUrl} />
          {imageUrl && (
            <Image src={imageUrl} alt="Recipe" height={500} width={500} />
          )}
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              container: "flex flex-col gap-2 mt-4",
              button:
                "!bg-[#748FB8] hover:!bg-[#48679d] text-white font-semibold py-2 px-4 rounded transition duration-200",
            }}
            onClientUploadComplete={(res) => {
              const uploadedUrl = res?.[0]?.ufsUrl;
              if (uploadedUrl) setImageUrl(uploadedUrl);
              else alert("Upload failed: No URL returned");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </Stack>

        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}
