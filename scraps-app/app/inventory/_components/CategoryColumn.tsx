import { useState, useEffect } from "react";
import ColorFilter from "./ColorFilter";
import InventoryItem from "./InventoryItem";
import Image from "next/image";
import {
  getColorListForCategory,
  getIngredientsByColor,
} from "@/app/actions";
import {
  CategoryIngredient,
  InventoryItem as InventoryItemType,
  Color,
} from "@/types/types";
// import { useUser } from "@clerk/nextjs";

interface CategoryColumnProps {
  category: CategoryIngredient;
  inventory: InventoryItemType[];
  onFilter: (color: number, categoryId: number) => void;
  onUpdateQuantity: (ingredientId: number, change: number) => void;
  onAddIngredient: (
    categoryId: number,
    ingredientId: number,
    ingredientName: string
  ) => void; // ✅ New prop
}

export default function CategoryColumn({
  category,
  inventory,
  onUpdateQuantity,
  onAddIngredient, // ✅ Receive the function
}: CategoryColumnProps) {
  // const { user } = useUser();
  const [showAddSection, setShowAddSection] = useState(false);
  const [filteredIngredients, setFilteredIngredients] = useState<
    { id: number; name: string }[]
  >([]);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);

  useEffect(() => {
    async function fetchColors() {
      const colors = await getColorListForCategory(category.id);
      setAvailableColors(colors);
    }
    fetchColors();
  }, [category.id]);

  const handleFilter = async (colorId: number) => {
    const ingredients = await getIngredientsByColor(category.id, colorId);
    setFilteredIngredients(ingredients);
  };

  return (
    <div className="inv-list-col">
      
      {/* TOP */}
      <div className="inv-list-top">
        {/* Category col list title */}
        <div className="inv-list-top-title">
          <Image
            src={`/icons/${category.name.replace(" ", "_")}.svg`}
            alt={`${category.name} icon`}
            className="logo"
            width={50}
            height={50}
          />
          <h3>{category.name}</h3>
        </div>

        {/* MIDDLE */}
        {/* Current inventory list */}
        <div className="inv-list-top-list">
          {inventory.length > 0 ? (
            <ul>
              {inventory.map((item) => (
                <InventoryItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </ul>
          ) : (
            <div className="inv-empty-message">
              <p></p>
            </div>
          )}
        </div>
      </div>
      {/* BOTTOM */}
      {/* Toggle  color button */}
      <button
        className="inv-list-toggle grow-element-normal"
        onClick={() => setShowAddSection(!showAddSection)}
        aria-expanded={showAddSection}
      >
        {showAddSection ? `▲ Add to ${category.name}` : `▼ Add to ${category.name}`}
      </button>
      {/* Color + Ingrdient container */}
      {showAddSection && availableColors.length > 0 && (
        <div className="inv-list-bottom-wrapper">

          {/* Dot filters */}
          <ColorFilter
            categoryId={category.id}
            colors={availableColors}
            onFilterAction={handleFilter}
          />

          {/* Add ingredients  */}
          <div className="inv-list-bottom-filt-ing">
            <h5>Select ingredient:</h5>
            {filteredIngredients.length > 0 && (
              <ul>
                {filteredIngredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="inv-list-bottom-filt-ing-item"
                  >
                    {ingredient.name}
                    {/* Add button */}
                    <button
                      className="ing-filt-btn small-btn grow-element-slow"
                      onClick={() =>
                        onAddIngredient(
                          category.id,
                          ingredient.id,
                          ingredient.name
                        )
                      }
                    >
                      +
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
