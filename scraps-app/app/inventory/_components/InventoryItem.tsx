import { InventoryItem as InventoryItemType } from "@/types/types";
import { Stack, Typography, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface InventoryItemProps {
  item: InventoryItemType;
  onUpdateQuantity: (ingredientId: number, change: number) => void;
}

export default function InventoryItem({
  item,
  onUpdateQuantity,
}: InventoryItemProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={1}
      id={`item-${item.id}`}
      sx={{ fontSize: "12px", mb: 0.5 }}
    >
      <Typography sx={{ flexGrow: 3, fontSize: "12px", fontFamily: "inherit" }}>
        {item.name}
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "12px",
          fontFamily: "inherit",
        }}
      >
        {item.quantity}
      </Typography>
      <Typography
        sx={{
          textAlign: "left",
          fontSize: "12px",
          fontFamily: "inherit"
        }}
      >
        {item.unit.abbreviation}
      </Typography>

      {/* Buttons */}
      <Stack direction="row">
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.id, -1)}
          sx={{
            p: "1px",
            fontSize: "12px",
            width: 18,
            height: 18,
          }}
        >
          <RemoveIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.id, 1)}
          sx={{
            p: "1px",
            fontSize: "12px",
            width: 18,
            height: 18,
          }}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
