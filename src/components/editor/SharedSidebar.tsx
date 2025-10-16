// src/components/editor/SharedSidebar.tsx
import React from "react";

interface SharedSidebarProps {
  title?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * SharedSidebar - consistent styling and responsive collapse for both 2D & 3D editor sidebars.
 * Usage:
 * <SharedSidebar title="3D Editor"> ...controls... </SharedSidebar>
 */
export const SharedSidebar: React.FC<SharedSidebarProps> = ({
  title,
  collapsed = false,
  onToggle,
  children,
  className = "",
}) => {
  return (
    <aside
      className={`bg-card border-r border-border p-3 transition-all duration-200 ease-in-out ${
        collapsed ? "w-16" : "w-80"
      } ${className}`}
      aria-hidden={collapsed}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className={`text-sm font-semibold truncate ${collapsed ? "opacity-0 w-0" : ""}`}>
          {title}
        </h2>
        <button
          aria-label="Toggle sidebar"
          onClick={onToggle}
          className="p-1 rounded hover:bg-muted"
        >
          {/* simple chevron icon using SVG to avoid external deps */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className={`${collapsed ? "rotate-180" : ""} transition-transform`}
          >
            <path d="M8 5l8 7-8 7V5z" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className={`overflow-auto ${collapsed ? "hidden" : "block"}`}>{children}</div>
    </aside>
  );
};
