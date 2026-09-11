import React, { useState, useEffect, useMemo, useRef } from "react";
import resourcesData from "./data/resources.json";
import Sidebar from "./components/Sidebar.tsx";
import SearchBar from "./components/SearchBar.tsx";
import CategorySection from "./components/CategorySection.tsx";
import DarkModeToggle from "./components/DarkModeToggle.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { Menu, Terminal, Info, ChevronRight, Loader2, Github } from "lucide-react";

interface Resource {
  name: string;
  url: string;
  description: string;
}

interface GroupedCategory {
  category: string;
  items: Resource[];
}

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<GroupedCategory[]>([]);
  const [filteredData, setFilteredData] = useState<GroupedCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Track manual clicks to stop intersection highlighting briefly (for smoother scrolling highlights)
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Simulated static data loading as requested (300ms latency)
  useEffect(() => {
    const loadResources = () => {
      try {
        setData(resourcesData);
        setFilteredData(resourcesData);
        if (resourcesData.length > 0) {
          setActiveCategory(resourcesData[0].category);
        }
      } catch (err) {
        console.error("Resource JSON load error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadResources, 300);
    return () => clearTimeout(timer);
  }, []);

  // Compute stats of matched items grouped by category for the sidebar
  const categoriesList = useMemo(() => {
    return resourcesData.map((cat) => {
      const matchCat = filteredData.find((fd) => fd.category === cat.category);
      return {
        name: cat.category,
        count: matchCat ? matchCat.items.length : 0,
      };
    });
  }, [filteredData]);

  // Handle updates coming back from SearchBar using Fuse.js
  const handleSearchResults = (
    results: GroupedCategory[],
    query: string
  ) => {
    setFilteredData(results);
    setSearchQuery(query);

    // Default active item to the first item with matches if current active lacks results
    if (results.length > 0) {
      const currentActiveStillExists = results.some((cat) => cat.category === activeCategory);
      if (!currentActiveStillExists) {
        setActiveCategory(results[0].category);
      }
    }
  };

  // Click scroll handler for a clean UX
  const handleCategoryClick = (categoryName: string) => {
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const element = document.getElementById(slug);
    if (element) {
      isScrollingRef.current = true;
      setActiveCategory(categoryName);
      
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      // Release intercepting hover rule after smooth-scrolling finishes
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 850);
    }
  };

  // IntersectionObserver intersection loop for active scrolling highlight syncing
  useEffect(() => {
    if (loading || filteredData.length === 0) return;

    const observerOption = {
      root: null,
      rootMargin: "-10% 0px -75% 0px", // Intersect near top of viewport
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingRef.current) return; // Prevent highlighting from overriding manual clicks

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const headerId = entry.target.id;
          // Find category name by slug match
          const activeCat = resourcesData.find(
            (cat) => cat.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === headerId
          );
          if (activeCat) {
            setActiveCategory(activeCat.category);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOption);

    // Watch all matching <h2> headers
    resourcesData.forEach((cat) => {
      const slug = cat.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const element = document.getElementById(slug);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [loading, filteredData]);

  if (loading) {
    return (
      <div id="loader-screen" className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-200">
        <div id="loader-spinner-wrapper" className="flex flex-col items-center gap-4">
          <Loader2 id="loader-spinner-svg" className="w-10 h-10 text-black dark:text-white animate-spin" />
          <p id="loader-spinner-text" className="font-sans font-medium text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
            Curating FreeStack Hub...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div id="app-root-container" className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col transition-colors duration-200">
        
        {/* Navigation Sticky Top Header */}
        <header id="app-header" className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-850 transition-colors duration-200">
          <div id="header-inner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
            
            {/* Header Brand Section */}
            <div id="header-brand-group" className="flex items-center gap-3">
              <button
                id="header-mobile-toggle"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-450 dark:hover:text-zinc-50 md:hidden hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                aria-label="Open categories menu"
              >
                <Menu id="mobile-toggle-icon" className="w-[22px] h-[22px]" />
              </button>
              
              <div id="brand-logo-panel" className="flex items-center gap-2.5">
                <div id="brand-avatar" className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-xs text-white dark:text-black">
                  <Terminal id="brand-logo-icon" className="w-5 h-5 leading-none" />
                </div>
                <div id="brand-text-panel" className="hidden sm:block">
                  <h1 id="brand-title" className="font-sans font-extrabold text-zinc-950 dark:text-zinc-50 text-base leading-tight tracking-tight">
                    FreeStack<span className="text-zinc-500 dark:text-zinc-400 font-medium pl-0.5">.hub</span>
                  </h1>
                  <p id="brand-sub" className="text-[10px] font-sans text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
                    CURATED DEVELOPER DIRECTORY
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Real-time Fuse.js Search Field */}
            <div id="header-search-wrapper" className="flex-1 md:flex-initial w-full md:max-w-md">
              <SearchBar resources={data} onSearch={handleSearchResults} />
            </div>

            {/* Right Action Widgets */}
            <div id="header-actions-group" className="flex items-center gap-2">
              <a
                id="header-info-link"
                href="https://github.com/Nierowheezy/freestack.hub"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 text-xs font-sans font-semibold text-zinc-600 dark:text-zinc-400 transition-colors"
              >
                <Github className="w-3.5 h-3.5 text-zinc-550 dark:text-zinc-400" />
                GitHub Repo
              </a>
              <DarkModeToggle />
            </div>

          </div>
        </header>

        {/* Primary Page Layout Body */}
        <div id="app-body-container" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
          
          {/* Collapsible Left Navigation Catalogue */}
          <Sidebar
            categories={categoriesList}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          {/* Main Content Area */}
          <main id="app-main-content" className="flex-1 min-w-0">
            
            {/* Curated Subtitle Hero Card */}
            {searchQuery === "" && (
              <div
                id="hero-dashboard-section"
                className="mb-10 p-6 sm:p-8 rounded-3xl bg-black text-white dark:bg-zinc-900 border border-black dark:border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden"
              >
                <div id="hero-pattern-deco" className="absolute top-0 right-0 w-48 h-48 bg-white/5 dark:bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />
                <div id="hero-inner-content" className="max-w-xl relative z-10">
                  <div id="hero-badge-tag" className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 dark:bg-zinc-800 border border-white/10 dark:border-zinc-700 text-[10px] text-zinc-200 dark:text-zinc-300 uppercase tracking-widest font-mono mb-4">
                    <Info className="w-3 h-3" />
                    Always Curated & Free
                  </div>
                  <h2 id="hero-content-title" className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight mb-2 text-zinc-50">
                    curated stack of developer utilities.
                  </h2>
                  <p id="hero-content-desc" className="font-sans text-sm text-zinc-400 leading-relaxed">
                    Build products and proof of concepts with robust, dependable developer ecosystems and free plans. Explore APIs, BaaS, AI frameworks, Databases, DNS, and more.
                  </p>
                </div>
              </div>
            )}

            {/* Active Search Context Bar */}
            {searchQuery !== "" && (
              <div id="search-feedback-wrapper" className="mb-8 flex items-baseline justify-between">
                <p id="search-feedback-count" className="font-sans text-sm text-zinc-600 dark:text-zinc-400">
                  Showing results for &ldquo;<span className="font-semibold text-zinc-900 dark:text-zinc-50">{searchQuery}</span>&rdquo;
                </p>
                <span id="search-feedback-total" className="text-xs font-mono text-zinc-400">
                  {filteredData.reduce((acc, cat) => acc + cat.items.length, 0)} tools found
                </span>
              </div>
            )}

            {/* Filtered Tool Grid Group Grid */}
            <div id="sections-scroll-panel" className="space-y-6">
              {filteredData.length > 0 ? (
                filteredData.map((cat) => (
                  <CategorySection
                    key={cat.category}
                    categoryName={cat.category}
                    items={cat.items}
                  />
                ))
              ) : (
                <div id="zero-state-container" className="py-24 text-center bg-white dark:bg-black rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
                  <div id="zero-state-icon" className="w-14 h-14 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Menu className="w-6 h-6 rotate-45" />
                  </div>
                  <h3 id="zero-state-title" className="font-sans font-bold text-zinc-900 dark:text-zinc-50 text-base mb-1">
                    No resources matched search
                  </h3>
                  <p id="zero-state-msg" className="font-sans text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">
                    Try adjusting your criteria, looking for simpler keywords, or checking spelling rules.
                  </p>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
