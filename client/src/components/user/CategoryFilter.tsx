"use client"
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const defaultCategories = [
  "All",
  "Fiction",
  "Non-fiction",
  "Drama",
  "Thriller",
  "Romance",
  "Educational",
  "Psychology",
  "Business",
  "Self-Help",
];

interface CategoryFilterProps {
  categories?: string[];
  genre: string; // current selected genre
  setGenre: (genre: string) => void;
}

const CategoryFilter = ({
  categories = defaultCategories,
  genre,
  setGenre,
}: CategoryFilterProps) => {
  const [active, setActive] = useState<string>("");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => {
            setActive(c);
            setGenre(c);
          }}
          aria-pressed={active === c}
          className="focus:outline-none"
        >
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
