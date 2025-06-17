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
import { Box, Button, Stack, Typography } from "@mui/material";
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
    <Stack
      direction="column"
      spacing={2}
      flexGrow={1}
      flexBasis={0}
      minWidth={200}
    >
      {/* TOP */}
      <Stack direction="column" spacing={1}>
        {/* Category col list title */}
        <Stack direction="row" alignItems="center" spacing={1} pl={0.5}>
          <Image
            src={`/icons/${category.name.replace(" ", "_")}.svg`}
            alt={`${category.name} icon`}
            width={20}
            height={20}
          />
          <Typography
            variant="body1"
            color="text.primary"
          >{category.name}</Typography>
        </Stack>

        {/* MIDDLE */}
        {/* Current inventory list */}
        <Box
          sx={{
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.14)",
            py: 3,
            pl: 3,
            pr: 2,
          }}
        >
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
        </Box>
      </Stack>

      {/* BOTTOM */}
      {/* Toggle  color button */}
      <Button
        onClick={() => setShowAddSection(!showAddSection)}
        variant="text"
        color="info"
      sx={{ fontSize: "0.9rem"}}>
        {showAddSection
          ? `▲ Add to ${category.name}`
          : `▼ Add to ${category.name}`}
      </Button>
      {/* Color + Ingrdient container */}
      {showAddSection && availableColors.length > 0 && (
        <Box ml={1.5} pl={2.5}>
          {/* Dot filters */}
          <ColorFilter
            categoryId={category.id}
            colors={availableColors}
            onFilterAction={handleFilter}
          />

          {/* Add ingredients  */}
          <Stack spacing={1} mt={1}>
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
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
