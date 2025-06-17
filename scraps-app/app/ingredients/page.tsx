import { getIngredientsByCategory } from "@/app/actions/ingredients";
import Link from "next/link";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Stack, Typography, Box } from "@mui/material";

// Tailwind & MUI utility classes
const classes = {
  container: "px-4 py-8 flex gap-5 justify-start flex-wrap content-start",
  categoryCol: "flex flex-col gap-3 flex-grow flex-shrink-0 min-w-[210px]",
  itemRow: "flex items-center justify-between w-full",
  title: "text-2xl font-semibold text-white",
};

export default async function IngredientsListPage() {
  const ingredients = await getIngredientsByCategory();

  // Group by categoryName
  const grouped = ingredients.reduce(
    (acc: Record<string, typeof ingredients>, item) => {
      const name = item.categoryName || "Unknown";
      (acc[name] ||= []).push(item);
      return acc;
    },
    {}
  );

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      className={classes.container}
    >
      {Object.entries(grouped).map(([category, items]) => (
        <Stack key={category} spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1} pl={0.5}>
            <Image
              src={`/icons/${category.replace(" ", "_")}.svg`}
              alt={`${category} icon`}
              width={20}
              height={20}
            />
            <Typography variant="body1" color="text.primary">
              {category}
            </Typography>
          </Stack>

          <Stack
            className={classes.categoryCol}
            sx={{
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.14)",
              py: 2,
              px: 2,
            }}
          >
            {/* Category header with icon */}

            <Stack component="ul">
              {items.map((ing) => (
                <li key={ing.ingredientId}>
                  <Box className={classes.itemRow}>
                    <Typography variant="body2" className="text-white">
                      {ing.ingredientName}
                    </Typography>
                    <Link href={`/ingredients/${ing.ingredientId}/edit`}>
                      <Settings
                        size={15}
                        className="text-gray-400 hover:text-white"
                      />
                    </Link>
                  </Box>
                </li>
              ))}
            </Stack>
          </Stack>
          
        </Stack>
      ))}
    </Stack>
  );
}
