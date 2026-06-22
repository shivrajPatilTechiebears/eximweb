"use client";

import { createContext, useContext, useState, useEffect } from "react";
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
}

const NavCtx = createContext<NavCtxValue>({
  activeSection: null,
  setActiveSection: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function NavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Initialise from the current URL so there's no flash on first render
  const [activeSection, setActiveSection] = useState<NavSection>(() => sectionFromPath(pathname));

  // Keep in sync when the URL changes (browser back/forward, direct navigation)
  useEffect(() => {
    const section = sectionFromPath(pathname);
    setActiveSection(section);
  }, [pathname]);

  return (
    <NavCtx.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </NavCtx.Provider>
  );
}

export const useNavCtx = () => useContext(NavCtx);
