"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULE_TABS } from "./SecondaryNav";

type SubItem = { label: string; href: string };

const WHITE_LABEL_SUB: SubItem[] = [
  { label: "Admin Management", href: "/admin-management" },
  { label: "Company Management", href: "/company-management" },
];

function isCreateUpdatePath(pathname: string) {
  return MODULE_TABS.some(
    tab =>
      pathname.startsWith(tab.href) ||
      (tab.sub?.some(s => pathname.startsWith(s.href)) ?? false)
  );
}

function WhiteLabelNavItem() {
  const pathname = usePathname();
  const isActive = WHITE_LABEL_SUB.some(s => pathname.startsWith(s.href));

  return (
    <div className="relative group">
      <Link
        href="/white-label"
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
          isActive
            ? "bg-[#8470ff] text-white shadow-sm"
            : "text-[#6B5FA6] hover:text-[#3B2F7A] hover:bg-[#DDD8F2]"
        }`}
      >
        White Label
        <svg
          className="w-2 h-2 opacity-40 transition-transform duration-150 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </svg>
      </Link>

      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-60 opacity-0 -translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-150">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-1.5 min-w-42">
          {WHITE_LABEL_SUB.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center px-3 py-2 rounded-xl text-[11px] text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FloatingNavbar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  const isCreateUpdateActive = isCreateUpdatePath(pathname);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 20 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-3 inset-x-0 z-50 flex justify-center transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center bg-[#EDEAF6] border border-[#D4CEEF] rounded-full shadow-[0_4px_24px_rgba(100,80,180,0.13)] px-1.5 py-1.5 gap-0.5">

        {/* Logo → dashboard */}
        <Link href="/" className="flex items-center gap-1.5 px-2.5 pr-3 shrink-0 group">
          <div className="w-4 h-4 bg-[#8470ff] rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm" />
          </div>
          <span className="text-gray-900 font-bold text-[11px] tracking-tight group-hover:text-[#8470ff] transition-colors">
            EXIM
          </span>
        </Link>

        <div className="w-px h-3.5 bg-[#C8C1E8] shrink-0" />

        <div className="flex items-center gap-0.5 px-1.5">

          {/* Create / Update → defaults to /purchase-order */}
          <Link
            href="/purchase-order"
            className={`flex items-center px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
              isCreateUpdateActive
                ? "bg-[#8470ff] text-white shadow-sm"
                : "text-[#6B5FA6] hover:text-[#3B2F7A] hover:bg-[#DDD8F2]"
            }`}
          >
            Create / Update
          </Link>

          {/* White Label */}
          <WhiteLabelNavItem />

          {/* Reports */}
          <Link
            href="/reports"
            className={`flex items-center px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
              pathname.startsWith("/reports")
                ? "bg-[#8470ff] text-white shadow-sm"
                : "text-[#6B5FA6] hover:text-[#3B2F7A] hover:bg-[#DDD8F2]"
            }`}
          >
            Reports
          </Link>

          {/* Document Library */}
          <Link
            href="/document-library"
            className={`flex items-center px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
              pathname.startsWith("/document-library")
                ? "bg-[#8470ff] text-white shadow-sm"
                : "text-[#6B5FA6] hover:text-[#3B2F7A] hover:bg-[#DDD8F2]"
            }`}
          >
            Document Library
          </Link>

          {/* Masters */}
          <Link
            href="/masters"
            className={`flex items-center px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
              pathname.startsWith("/masters")
                ? "bg-[#8470ff] text-white shadow-sm"
                : "text-[#6B5FA6] hover:text-[#3B2F7A] hover:bg-[#DDD8F2]"
            }`}
          >
            Masters
          </Link>
        </div>

        <div className="w-px h-3.5 bg-[#C8C1E8] shrink-0" />

        {/* Bell */}
        <button className="p-1.5 mx-0.5 text-[#9B90C8] hover:text-[#3B2F7A] hover:bg-[#DDD8F2] rounded-full transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* User */}
        <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#DDD8F2] rounded-full transition-colors shrink-0">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
            S
          </div>
          <span className="text-[11px] text-[#6B5FA6]">Shivam</span>
          <svg className="w-2.5 h-2.5 text-[#9B90C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
