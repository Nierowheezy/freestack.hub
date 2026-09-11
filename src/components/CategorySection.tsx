import React from "react";
import ItemCard from "./ItemCard.tsx";

interface Resource {
  name: string;
  url: string;
  description: string;
}

interface CategorySectionProps {
  key?: any;
  categoryName: string;
  items: Resource[];
}

export default function CategorySection({ categoryName, items }: CategorySectionProps): React.JSX.Element | null {
  // Slugify category name for smooth scrolling index
  const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id={`section-${categorySlug}`}
      className="scroll-mt-24 mb-16 last:mb-0"
    >
      <div id={`header-container-${categorySlug}`} className="flex items-baseline justify-between border-b border-zinc-150 dark:border-zinc-800 pb-3 mb-6">
        <h2
          id={categorySlug}
          className="font-sans font-bold text-zinc-950 dark:text-zinc-50 text-xl tracking-tight"
        >
          {categoryName}
        </h2>
        <span id={`count-badge-${categorySlug}`} className="font-mono text-zinc-400 text-xs">
          {items.length} {items.length === 1 ? "tool" : "tools"}
        </span>
      </div>

      <div
        id={`grid-${categorySlug}`}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((item, index) => (
          <ItemCard
            key={`${item.name}-${index}`}
            item={item}
            categoryName={categoryName}
          />
        ))}
      </div>
    </section>
  );
}
