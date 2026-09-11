import { Menu, X, ArrowUpRight } from "lucide-react";

interface Category {
  name: string;
  count: number;
}

interface SidebarProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryName: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  categories,
  activeCategory,
  onCategoryClick,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          id="sidebar-overlay"
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-350"
        />
      )}

      {/* Sidebar Navigation Panel */}
      <aside
        id="app-sidebar"
        className={`fixed md:sticky top-0 left-0 h-screen md:h-[calc(100vh-4.5rem)] w-[260px] bg-white dark:bg-black border-r border-zinc-200 dark:border-zinc-800 z-50 md:z-10 transition-transform duration-300 md:translate-x-0 overflow-y-auto flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div id="sidebar-content-wrapper" className="p-6">
          <div id="sidebar-mobile-header" className="flex items-center justify-between md:hidden mb-6 border-b border-zinc-100 dark:border-zinc-950/20 pb-4">
            <span id="sidebar-mobile-title" className="font-sans font-bold text-zinc-900 dark:text-zinc-50 text-lg">
              Categories
            </span>
            <button
              id="sidebar-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              aria-label="Close menu"
            >
              <X id="sidebar-close-icon" className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div id="sidebar-section-title" className="hidden md:block mb-4">
            <h3 className="font-sans font-semibold text-xs tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
              TOOL CATALOGUE
            </h3>
          </div>

          <nav id="sidebar-nav" className="space-y-1.5">
            {categories.map((cat) => {
              const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              const isActive = activeCategory === cat.name;

              return (
                <button
                  key={cat.name}
                  id={`sidebar-item-${slug}`}
                  onClick={() => {
                    onCategoryClick(cat.name);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-sans transition-all group ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                      : "text-zinc-600 dark:text-zinc-450 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium"
                  }`}
                >
                  <span id={`sidebar-item-label-${slug}`} className="truncate pr-2">
                    {cat.name}
                  </span>
                  <span
                    id={`sidebar-item-count-${slug}`}
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-md ${
                      isActive
                        ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black"
                        : "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Credit Line */}
        <div id="sidebar-footer" className="p-6 border-t border-zinc-100/40 dark:border-zinc-900/40">
          <div id="sidebar-footer-link" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors">
            <span>Powering build stacks</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p id="sidebar-copyright" className="text-[10px] font-sans text-zinc-450 dark:text-zinc-500 mt-1">
            © 2026 FreeStack Hub.
          </p>
        </div>
      </aside>
    </>
  );
}
