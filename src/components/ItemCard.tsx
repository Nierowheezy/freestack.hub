import React from "react";
import { ExternalLink } from "lucide-react";

interface Resource {
  name: string;
  url: string;
  description: string;
}

interface ItemCardProps {
  key?: any;
  item: Resource;
  categoryName: string;
}

export default function ItemCard({ item, categoryName }: ItemCardProps): React.JSX.Element {
  const itemSlug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  return (
    <div
      id={`resource-card-${itemSlug}`}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.03)] transform hover:-translate-y-1 transition-all duration-300"
    >
      <div id={`card-inner-top-${itemSlug}`}>
        <div id={`card-header-flex-${itemSlug}`} className="flex items-start justify-between gap-4 mb-3">
          <h3 id={`card-title-${itemSlug}`} className="font-sans font-semibold text-zinc-900 dark:text-zinc-50 text-base leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">
            {item.name}
          </h3>
          <a
            id={`card-link-${itemSlug}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer referrer"
            className="p-1.5 rounded-lg text-zinc-400 group-hover:text-black dark:group-hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            title={`Go to ${item.name}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <p id={`card-desc-${itemSlug}`} className="text-zinc-600 dark:text-zinc-300 text-sm font-sans line-clamp-3 mb-5 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div id={`card-inner-bottom-${itemSlug}`} className="flex items-center justify-between">
        <span
          id={`card-badge-${itemSlug}`}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 tracking-wide border border-zinc-200/20"
        >
          {categoryName}
        </span>
        <a
          id={`card-action-link-${itemSlug}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer referrer"
          className="text-xs font-bold text-black dark:text-white hover:underline inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          Visit site →
        </a>
      </div>
    </div>
  );
}
