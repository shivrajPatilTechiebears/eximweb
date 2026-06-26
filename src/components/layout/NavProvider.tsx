"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

export type NavSection = "createUpdate" | "whiteLabel" | null;

// Paths that belong to each top-level section
const MODULE_PATHS      = ["/image-library", "/purchase-request", "/purchase-order", "/shipments", "/bookings"];
const WHITE_LABEL_PATHS = ["/admin-management", "/company-management", "/role-permissions", "/employee-management"];

function sectionFromPath(pathname: string): NavSection {
  if (MODULE_PATHS.some(p => pathname.startsWith(p)))      return "createUpdate";
  if (WHITE_LABEL_PATHS.some(p => pathname.startsWith(p))) return "whiteLabel";
  return null;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface NavCtxValue {
  activeSection: NavSection;
  setActiveSection: (s: NavSection) => void;
  hoveredSection: NavSection;
  enterHover: (section: NavSection) => void;
  leaveHover: () => void;
}

const NavCtx = createContext<NavCtxValue>({
  activeSection: null,
  setActiveSection: () => {},
  hoveredSection: null,
  enterHover: () => {},
  leaveHover: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function NavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Initialise from the current URL so there's no flash on first render
  const [activeSection, setActiveSection] = useState<NavSection>(() => sectionFromPath(pathname));
  const [hoveredSection, setHoveredSection] = useState<NavSection>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep in sync when the URL changes (browser back/forward, direct navigation)
  useEffect(() => {
    setActiveSection(sectionFromPath(pathname));
  }, [pathname]);

  const enterHover = (section: NavSection) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredSection(section);
  };

  // 200ms grace period lets the mouse travel the gap between the pill and the secondary nav
  const leaveHover = () => {
    hoverTimer.current = setTimeout(() => setHoveredSection(null), 200);
  };

  return (
    <NavCtx.Provider value={{ activeSection, setActiveSection, hoveredSection, enterHover, leaveHover }}>
      {children}
    </NavCtx.Provider>
  );
}

export const useNavCtx = () => useContext(NavCtx);
