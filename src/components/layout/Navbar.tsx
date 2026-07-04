"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { NAV_PILLS, NAV_PLAIN_LINKS, pillPaths, type NavPillKey, type NavModuleTab } from "./nav-config";

// FloatingNavbar (top pill bar) and its SecondaryNav flyout only ever render together
// and only ever talk to each other, so they live in one component with plain local
// state instead of a shared Context — nothing outside this file needs their hover state.

// Top-level pill in the floating bar — wraps the shared Button "nav-pill" variant in a
// real Link so it stays a genuine navigable anchor, not a JS-only button.
function NavPillLink({
  href, label, active, onMouseEnter, onMouseLeave,
}: {
  href: string; label: string; active: boolean;
  onMouseEnter?: () => void; onMouseLeave?: () => void;
}) {
  return (
    <Link href={href} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Button variant="nav-pill" className={active ? "nav-pill-active" : "nav-pill-inactive"}>
        {label}
      </Button>
    </Link>
  );
}

function TabPill({ tab }: { tab: NavModuleTab }) {
  const pathname = usePathname();
  const isActive =
    pathname.startsWith(tab.href) ||
    (tab.sub?.some(s => pathname.startsWith(s.href)) ?? false);

  return (
    <Link href={tab.href}>
      <Button variant="tab-pill" className={isActive ? "tab-pill-active" : "tab-pill-inactive"}>
        {tab.label}
      </Button>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [hoveredSection, setHoveredSection] = useState<NavPillKey | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shared scroll-hide signal — both the pill bar and the flyout fade out on scroll-down
  // and reappear on scroll-up, computed once from the same scroll position.
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 20 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const enterHover = (section: NavPillKey) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoveredSection(section);
  };

  // 200ms grace period lets the mouse travel the gap between the pill and the flyout
  const leaveHover = () => {
    hoverTimer.current = setTimeout(() => setHoveredSection(null), 200);
  };

  const flyoutTabs = NAV_PILLS.find((p) => p.key === hoveredSection)?.tabs ?? [];

  return (
    <>
      {/* First navbar — always-visible top pill bar (logo, nav pills, bell, user menu) */}
      <div
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
        }`}
      >
        <div className="nav-surface rounded-full flex items-center px-1.5 py-1.5 gap-0.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 px-2.5 pr-3 shrink-0 group">
            <div className="nav-logo-mark">
              <div className="nav-logo-dot" />
            </div>
            <span className="text-gray-900 font-bold text-[11px] tracking-tight group-hover:text-[#884D70] transition-colors">
              EXIM
            </span>
          </Link>

          <div className="w-px h-3.5 nav-separator shrink-0" />

          <div className="flex items-center gap-0.5 px-1.5">
            {NAV_PILLS.map((navPill) => (
              <NavPillLink
                key={navPill.key}
                href={navPill.href}
                label={navPill.label}
                active={pillPaths(navPill).some((p) => pathname.startsWith(p))}
                onMouseEnter={() => enterHover(navPill.key)}
                onMouseLeave={leaveHover}
              />
            ))}

            {NAV_PLAIN_LINKS.map((link) => (
              <NavPillLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname.startsWith(link.href)}
              />
            ))}
          </div>

          <div className="w-px h-3.5 nav-separator shrink-0" />

          {/* Bell */}
          <Button variant="icon-nav" className="mx-0.5">
            <Icon name="notifications" size={14} strokeWidth={2} />
          </Button>

          {/* User */}
          <Button variant="user-menu">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
              S
            </div>
            <span className="text-[11px] text-[#884D70]/70">Shivam</span>
            <Icon name="expand_more" size={10} strokeWidth={2} className="text-[#884D70]/50" />
          </Button>
        </div>
      </div>

      {/* Second navbar — hover flyout, only mounted while a pill with tabs is hovered */}
      {hoveredSection && (
        // left-1/2 -translate-x-1/2 (instead of inset-x-0 + flex justify-center) makes this
        // box shrink-wrap to its own content and centers it by its own width, so the fixed
        // box never extends past the visible pill — no dead zone to swallow clicks elsewhere.
        <div
          className={`fixed top-0 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-2rem)] transition-transform duration-500 ease-in-out ${visible ? "translate-y-14" : "translate-y-0"
            }`}
          onMouseEnter={() => enterHover(hoveredSection)}
          onMouseLeave={leaveHover}
        >
          {/* Horizontally scrollable when the pill is wider than the viewport */}
          <div className="py-2 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <div className="nav-surface rounded-[14px] flex items-center p-1 gap-0.5 min-w-max">
              {/*
                Changing `key` unmounts the old group and mounts the new one,
                replaying the CSS enter animation on every section switch.
              */}
              <div
                key={hoveredSection}
                className="flex items-center gap-0.5"
                style={{ animation: "secNavFadeIn 0.22s ease-out both" }}
              >
                {flyoutTabs.map(tab => (
                  <TabPill key={tab.href} tab={tab} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
