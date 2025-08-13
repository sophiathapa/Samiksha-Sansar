import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const defaultCategories = [
  "All",
  "Fantasy",
  "Drama",
  "Detective",
  "Education",
  "Psychology",
  "Business",
  "Astrology",
];

interface CategoryFilterProps {
  categories?: string[];
}

const CategoryFilter = ({ categories = defaultCategories }: CategoryFilterProps) => {
  const [active, setActive] = useState<string>(categories[0]);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map((c) => (
        <button key={c} onClick={() => setActive(c)} aria-pressed={active === c} className="focus:outline-none">
          <Badge
            variant={active === c ? "default" : "secondary"}
            className="rounded-full px-3 py-1"
          >
            {c}
          </Badge>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;