"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  updateRecipe,
  updateRecipeIngredients,
  getRecipeById,
} from "@/app/actions/recipes";
import { getAllIngredients } from "@/app/actions/ingredients";
import { getUnitList } from "@/app/actions/common";
import { getAllRecipeCategories } from "@/app/actions/recipes";
import {
  CategoryRecipe,
  Unit,
  Ingredient,
  RecipeIngredient,
  FullRecipe,
} from "@/types/types";
import { UploadButton } from "@/app/api/uploadthing/uploadthing";
import { SelectableRow } from "../../_components/SelectableRow";

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useParams();
  const recipeId = parseInt(id as string, 10);

  const [recipe, setRecipe] = useState<FullRecipe | null>(null);
  const [categories, setCategories] = useState<CategoryRecipe[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<
    RecipeIngredient[]
  >([]);
  const [imageUrl, setImageUrl] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    method: "",
    difficultyLevel: "",
    time: 0,
    servings: 0,
    categoryRecipeId: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [recipeData, categoryData, unitData, ingredientData] =
          await Promise.all([
            getRecipeById(recipeId),
            getAllRecipeCategories(),
            getUnitList(),
            getAllIngredients(),
          ]);

        if (!recipeData) {
          console.error("Recipe not found!");
          return;
        }

        setRecipe(recipeData);
        setCategories(categoryData);
        setUnits(unitData);
        setIngredients(ingredientData);
        setRecipeIngredients(recipeData.ingredients);

        setFormData({
          title: recipeData.title,
          method: recipeData.method,
          difficultyLevel: recipeData.difficultyLevel,
          time: recipeData.time,
          servings: recipeData.servings,
          categoryRecipeId: recipeData.category.id.toString(),
        });

        if (recipeData.image) {
          setImageUrl(recipeData.image);
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    }
    fetchData();
  }, [recipeId]);

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

  const handleAddIngredient = (
    ing: Ingredient,
    unitId: number,
    quantity: number
  ) => {
    const foundUnit = units.find((u) => u.id === unitId);
    if (!foundUnit) return;

    const newItem: RecipeIngredient = {
      id: Date.now(),
      recipeId,
      ingredient: ing,
      unit: foundUnit,
      quantityNeeded: quantity,
    };
    setRecipeIngredients((prev) => [...prev, newItem]);
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    setRecipeIngredients((prev) =>
      prev.filter((ri) => ri.ingredient.id !== ingredientId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("method", formData.method);
      formDataObj.append("difficultyLevel", formData.difficultyLevel);
      formDataObj.append("time", formData.time.toString());
      formDataObj.append("servings", formData.servings.toString());
      formDataObj.append("categoryRecipeId", formData.categoryRecipeId);
      formDataObj.append("image_url", imageUrl || "");

      await updateRecipe(recipeId, formDataObj);
      await updateRecipeIngredients(recipeId, recipeIngredients);
      alert("Recipe updated successfully!");
      router.push(`/recipes`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe.");
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="edit-recipe-form-container" id="recipe-form">
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
            options={["Easy", "Medium", "Hard"]}
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
            options={[1, 2, 4, 6, 8]}
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

          <label htmlFor="image_url">Image</label>
          {imageUrl && (
            <Image src={imageUrl} alt="Recipe" height={400} width={400} />
          )}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              const uploadedUrl = res?.[0]?.ufsUrl;
              if (uploadedUrl) setImageUrl(uploadedUrl);
              else alert("Upload failed: No URL returned");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
          <input type="hidden" name="image_url" value={imageUrl} />

          <h3>Ingredients</h3>
          {recipeIngredients.length > 0 ? (
            <ul>
              {recipeIngredients.map((ri) => (
                <li key={ri.id}>
                  {ri.quantityNeeded} {ri.unit.abbreviation}{" "}
                  {ri.ingredient.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ri.ingredient.id)}
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No ingredients added.</p>
          )}

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
                  (
                    document.getElementById(
                      "ingredientSelect"
                    ) as HTMLSelectElement
                  ).value
                );
                const unitId = parseInt(
                  (document.getElementById("unitSelect") as HTMLSelectElement)
                    .value
                );
                const quantity = parseFloat(
                  (document.getElementById("quantityInput") as HTMLInputElement)
                    .value
                );

                const foundIng = ingredients.find(
                  (ing) => ing.id === ingredientId
                );
                if (foundIng && unitId && quantity > 0) {
                  handleAddIngredient(foundIng, unitId, quantity);
                }
              }}
            >
              Add
            </button>
          </div>
        </div>

        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
}
