import { CategoryRecipe } from "@/types/types";

type Props = {
  categories: CategoryRecipe[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
};

export default function CategoryList({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  return (
    <div className="row-cat">
      <ul className="row-cat-list">
        {categories.map((cat) => (
          <li key={cat.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(cat.id);
              }}
              className={`lowercase ${
                selectedCategoryId === cat.id ? "active" : ""
              }`}
            >
              {cat.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
