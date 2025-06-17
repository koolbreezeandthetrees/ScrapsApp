import { Color } from "@/types/types";
import { Stack } from "@mui/material";

interface ColorFilterProps {
  categoryId: number;
  colors: Color[]; // ✅ Receive filtered colors
  onFilterAction: (colorId: number) => void;
}

export default function ColorFilter({
  colors,
  onFilterAction,
}: ColorFilterProps) {
  return (
    <Stack spacing={1}>
      <h5>Select by color:</h5>
      <Stack direction="row" spacing={1} className="mt-1">
        {colors.map((color) => (
          <div
            key={color.id}
            className="w-2.5 h-2.5 rounded-full cursor-pointer"
            style={{ backgroundColor: color.colorCode }}
            onClick={() => onFilterAction(color.id)}
          />
        ))}
      </Stack>
    </Stack>
  );
}

