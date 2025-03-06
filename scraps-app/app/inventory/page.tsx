"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  addIngredientToInventory,
  checkInventory,
  createInventory,
  getInventory,
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
    try {
      const response = await fetch("/api/update-quantity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient_id: ingredientId, quantity: change }),
      });

      if (response.ok) {
        const data = await response.json();
        setInventory((prevInventory) => {
          const updatedInventory = { ...prevInventory };
          Object.keys(updatedInventory).forEach((categoryId) => {
            updatedInventory[Number(categoryId)] = updatedInventory[
              Number(categoryId)
            ].map((item) =>
              item.id === ingredientId
                ? { ...item, quantity: data.new_quantity }
                : item
            );
          });
          return updatedInventory;
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleAddIngredient = async (
    categoryId: number,
    ingredientId: number,
    ingredientName: string
  ) => {
    if (!user?.id) return;

    const result = await addIngredientToInventory(user.id, ingredientId);

    if (result.success) {
      setInventory((prevInventory) => {
        const updatedInventory = { ...prevInventory };
        updatedInventory[categoryId] = [
          ...(updatedInventory[categoryId] || []),
          {
            id: ingredientId,
            name: ingredientName,
            quantity: 1,
            unit: { id: 0, name: "", abbreviation: "" },
            categoryId: categoryId,
          },
        ];
        return updatedInventory;
      });
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
