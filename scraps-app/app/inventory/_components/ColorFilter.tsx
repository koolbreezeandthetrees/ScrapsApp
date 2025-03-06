import { Color } from "@/types/types";

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
    <div className="inv-list-bottom-dots-wrapper">
      <h5>Select by color:</h5>
      <div className="color-dots">
        {colors.map((color) => (
          <div
            key={color.id}
            className="color-dot"
            style={{ backgroundColor: color.colorCode }}
            onClick={() => onFilterAction(color.id)}
          />
        ))}
      </div>
    </div>
  );
}
