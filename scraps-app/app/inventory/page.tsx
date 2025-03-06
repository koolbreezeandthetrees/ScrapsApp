"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  addIngredientToInventory,
  checkInventory,
  createInventory,
  getIngredientById,
  getInventory,
  updateInventoryQuantity,
} from "../actions";
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

  useEffect(() => {
    if (!user?.id) return;

    async function fetchData() {
      if (!user) return;
      const exists = await checkInventory(user.id);
      setHasInventory(!!exists);

      if (exists) {
        const data = await getInventory(user.id);

        // ✅ Sort categories by ID before updating state
        const sortedCategories = [...data.categories].sort(
          (a, b) => a.id - b.id
        );

        setCategories(sortedCategories);
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

    // ✅ Optimistically update state
    setInventory((prevInventory) => {
      const updatedInventory = { ...prevInventory };

      Object.keys(updatedInventory).forEach((categoryId) => {
        updatedInventory[Number(categoryId)] = updatedInventory[
          Number(categoryId)
        ].map((item) =>
          item.id === ingredientId
            ? { ...item, quantity: item.quantity + change } // Increase or decrease quantity
            : item
        );
      });

      return updatedInventory;
    });

    try {
      const result = await updateInventoryQuantity(
        user.id,
        ingredientId,
        change
      );

      if (!result.success) {
        throw new Error("API failed"); // Rollback if API fails
      }
    } catch (error) {
      console.error("Error updating quantity:", error);

      // ❌ Rollback state if API fails
      setInventory((prevInventory) => {
        const updatedInventory = { ...prevInventory };

        Object.keys(updatedInventory).forEach((categoryId) => {
          updatedInventory[Number(categoryId)] = updatedInventory[
            Number(categoryId)
          ].map((item) =>
            item.id === ingredientId
              ? { ...item, quantity: item.quantity - change } // Revert change
              : item
          );
        });

        return updatedInventory;
      });
    }
  };


const handleAddIngredient = async (
  categoryId: number,
  ingredientId: number
) => {
  if (!user?.id) return;

  const result: { success: boolean; message?: string } = await addIngredientToInventory(user.id, ingredientId);

  if (result.success) {
    // ✅ Fetch full ingredient details after adding
    const newIngredient = await getIngredientById(ingredientId);

    setInventory((prevInventory) => {
      const updatedInventory = { ...prevInventory };
      updatedInventory[categoryId] = [
        ...(updatedInventory[categoryId] || []),
        {
          ...newIngredient,
          quantity: 1, // or any default quantity
          categoryId: categoryId,
        },
      ];
      return updatedInventory;
    });
  } else {
    alert("Error adding ingredient: " + result.message);
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
              onFilter={(color, categoryId) =>
                console.log(`Filter by ${color} in category ${categoryId}`)
              }
              onUpdateQuantity={handleUpdateQuantity}
              onAddIngredient={handleAddIngredient}
            />
          ))}
        </div>
      ) : (
        <button onClick={handleCreateInventory}>Create Inventory</button>
      )}
      <IngredientForm />
    </div>
  );
}
