import { useState, useMemo, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";

interface Resource {
  name: string;
  url: string;
  description: string;
}

interface GroupedCategory {
  category: string;
  items: Resource[];
}

interface SearchBarProps {
  resources: GroupedCategory[];
  onSearch: (filtered: GroupedCategory[], query: string) => void;
}

// Flattened structure for Fuse indexing
interface FlatResourceItem extends Resource {
  categoryName: string;
}

export default function SearchBar({ resources, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isMac, setIsMac] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create a flattened list of items for Fuse search
  const flatItems = useMemo(() => {
    const flattened: FlatResourceItem[] = [];
    resources.forEach((cat) => {
      cat.items.forEach((item) => {
        flattened.push({
          ...item,
          categoryName: cat.category,
        });
      });
    });
    return flattened;
  }, [resources]);

  // Handle OS detection safety for Mac vs Windows/Linux
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/Mac|iPod|iPhone|iPad/i.test(navigator.userAgent));
    }
  }, []);

  // Set up global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key?.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }

      // Allow "/" to focus if user is not currently in any editable field
      if (e.key === "/" && document.activeElement) {
        const tagName = document.activeElement.tagName;
        const isEditable = document.activeElement.getAttribute("contenteditable") === "true";
        if (
          tagName !== "INPUT" &&
          tagName !== "TEXTAREA" &&
          !isEditable
        ) {
          e.preventDefault();
          inputRef.current?.focus();
          inputRef.current?.select();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Build the Fuse database instance once
  const fuse = useMemo(() => {
    return new Fuse(flatItems, {
      keys: ["name", "description"],
      threshold: 0.3,
      useExtendedSearch: true,
      ignoreLocation: true,
    });
  }, [flatItems]);

  // Track stable callback reference to prevent any infinite rendering loop
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  // Handle fuzzy searching on query changes
  useEffect(() => {
    if (!query.trim()) {
      // Return original structure if query is empty
      onSearchRef.current(resources, "");
      return;
    }

    const searchResults = fuse.search(query);
    
    // Group search results back by category to maintain structure
    const categoryMap: { [key: string]: Resource[] } = {};
    
    // Initialize empty maps for categories to preserve category order
    resources.forEach(cat => {
      categoryMap[cat.category] = [];
    });

    // Populate search matches
    searchResults.forEach((result) => {
      const item = result.item;
      const originalItem: Resource = {
        name: item.name,
        url: item.url,
        description: item.description,
      };
      if (!categoryMap[item.categoryName]) {
        categoryMap[item.categoryName] = [];
      }
      categoryMap[item.categoryName].push(originalItem);
    });

    // Reconstruct GroupedCategory list (only retaining non-empty matches)
    const filteredGrouped: GroupedCategory[] = resources
      .map((cat) => ({
        category: cat.category,
        items: categoryMap[cat.category] || [],
      }))
      .filter((cat) => cat.items.length > 0);

    onSearchRef.current(filteredGrouped, query);
  }, [query, resources, fuse]);

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div id="search-bar-container" className="w-full max-w-md mx-auto">
      <div id="search-input-wrapper" className="relative flex items-center">
        <Search
          id="search-icon"
          className="absolute left-4 w-5 h-5 text-zinc-400 dark:text-zinc-500 pointer-events-none"
        />
        <input
          id="search-input-box"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search free APIs, databases, AI tools..."
          className="w-full font-sans pl-12 pr-12 py-3 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm focus:outline-none focus:border-black dark:focus:border-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/10 transition-all text-sm"
        />
        {!query && !isFocused && (
          <div
            id="search-shortcut"
            className="absolute right-4 hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500 pointer-events-none select-none"
          >
            {isMac ? "⌘K" : "Ctrl K"}
          </div>
        )}
        {query && (
          <button
            id="search-clear-button"
            onClick={handleClear}
            className="absolute right-3.5 p-1 rounded-xl text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Clear search"
          >
            <X id="search-clear-icon" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
