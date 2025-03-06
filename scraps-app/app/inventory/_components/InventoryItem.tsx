import { InventoryItem as InventoryItemType } from "@/types/types";

interface InventoryItemProps {
  item: InventoryItemType;
  onUpdateQuantity: (ingredientId: number, change: number) => void;
}

export default function InventoryItem({
  item,
  onUpdateQuantity,
}: InventoryItemProps) {
  return (
    <li className="inv-list-top-item" id={`item-${item.id}`}>
      <span className="inv-list-top-item-name">{item.name}</span>
      <span className="inv-list-top-item-quantity">{item.quantity}</span>
      <span className="inv-list-top-item-unit">{item.unit.abbreviation}</span>

      <div className="inv-list-top-item-buttons">
        <button onClick={() => onUpdateQuantity(item.id, -1)}> - </button>
        <button onClick={() => onUpdateQuantity(item.id, 1)}> + </button>
      </div>
    </li>
  );
}
