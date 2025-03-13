"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  addIngredientToInventory,
  checkInventory,
  createInventory,
  getInventory,
  updateInventoryQuantity,
} from "@/app/actions/inventory";
import { getIngredientById } from "@/app/actions/ingredients";
import IngredientForm from "./_components/IngredientForm";
import CategoryColumn from "./_components/CategoryColumn";
import { CategoryIngredient, InventoryItem } from "@/types/types";

export default function InventoryPage() {
  const { user } = useUser();
  const [hasInventory, setHasInventory] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<CategoryIngredient[]>([]);
  const [inventory, setInventory] = useState<{
    [key: number]: InventoryItem[];
  }>({});
  const [showIngredientForm, setShowIngredientForm] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchData() {
      const exists = user ? await checkInventory(user.id) : false;
      setHasInventory(Boolean(exists));

      if (exists) {
        if (!user) return;
        const data = await getInventory(user.id);
        setCategories([...data.categories].sort((a, b) => a.id - b.id));
        setInventory(data.inventory);
      }
    }

    fetchData();
  }, [user]);

  const handleCreateInventory = async () => {
    if (!user?.id) return;
    await createInventory(user.id);
    setHasInventory(true);
  };

  const handleUpdateQuantity = async (ingredientId: number, change: number) => {
    if (!user?.id) return;

    // Optimistic UI update
    setInventory((prevInventory) => {
      const updatedInventory = { ...prevInventory };
      Object.keys(updatedInventory).forEach((categoryId) => {
        updatedInventory[Number(categoryId)] = updatedInventory[
          Number(categoryId)
        ]
          .map((item) =>
            item.id === ingredientId
              ? { ...item, quantity: item.quantity + change }
              : item
          )
          .filter((item) => item.quantity > 0); // ✅ Remove items with zero quantity
      });
      return updatedInventory;
    });

    try {
      const result = await updateInventoryQuantity(
        user.id,
        ingredientId,
        change
      );
      if (!result.success) throw new Error("API failed");
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Rollback UI if API call fails
      setInventory((prevInventory) => {
        const rolledBackInventory = { ...prevInventory };
        Object.keys(rolledBackInventory).forEach((categoryId) => {
          rolledBackInventory[Number(categoryId)] = rolledBackInventory[
            Number(categoryId)
          ]
            .map((item) =>
              item.id === ingredientId
                ? { ...item, quantity: item.quantity - change }
                : item
            )
            .filter((item) => item.quantity > 0); // ✅ Ensure rollback also removes zero-quantity items
        });
        return rolledBackInventory;
      });
    }
  };

  const handleAddIngredient = async (
    categoryId: number,
    ingredientId: number
  ) => {
    if (!user?.id) return;

    const result = await addIngredientToInventory(user.id, ingredientId);
    if (result.success) {
      const newIngredient = await getIngredientById(ingredientId);

      setInventory((prevInventory) => {
        const updatedInventory = { ...prevInventory };

        const existingItem = updatedInventory[categoryId]?.find(
          (item) => item.id === ingredientId
        );

        if (existingItem) {
          // ✅ If ingredient exists, increase quantity
          updatedInventory[categoryId] = updatedInventory[categoryId].map(
            (item) =>
              item.id === ingredientId
                ? { ...item, quantity: item.quantity + 1 }
                : item
          );
        } else {
          // ✅ Otherwise, add new ingredient
          updatedInventory[categoryId] = [
            ...(updatedInventory[categoryId] || []),
            { ...newIngredient, quantity: 1, categoryId },
          ];
        }

        return updatedInventory;
      });
    } else {
      const errorMessage = 'message' in result ? result.message : "Unknown error";
      alert("Error adding ingredient: " + errorMessage);
    }
  };

  return (
    <div className="inv-container-main">
      {hasInventory === null ? (
        <p>Loading...</p>
      ) : hasInventory ? (
        <div className="inv-lists">
          {categories.map((category) => (
            <CategoryColumn
              key={category.id}
              category={category}
              inventory={inventory[category.id] || []}
              onUpdateQuantity={handleUpdateQuantity}
              onAddIngredient={handleAddIngredient}
              onFilter={() => {}}
            />
          ))}
        </div>
      ) : (
        <button onClick={handleCreateInventory}>Create Inventory</button>
      )}

      {/* ✅ Toggle button for the form */}
      <button
        className="floating-btn"
        onClick={() => setShowIngredientForm((prev) => !prev)}
      >
        {showIngredientForm ? "Close Form" : "+ Add Ingredient"}
      </button>

      {/* ✅ Conditionally render the IngredientForm */}
      {showIngredientForm && <IngredientForm />}
    </div>
  );
}
