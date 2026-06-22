"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavCtx } from "./NavProvider";

export function FloatingNavbar() {
  const pathname = usePathname();
  const { activeSection, setActiveSection } = useNavCtx();
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

  // Pill class builder — active = filled purple, inactive = ghost
  const pill = (active: boolean) =>
    `flex items-center px-3 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
      active
        ? "bg-[#884D70] text-white shadow-sm"
        : "text-[#884D70]/70 hover:text-[#884D70] hover:bg-[#884D70]/10"
    }`;

  return (
    <div
      className={`fixed top-3 inset-x-0 z-50 flex justify-center transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center bg-[#FFDBCB]/10 border border-[#884D70]/25 rounded-full shadow-[0_4px_24px_rgba(136,77,112,0.13)] px-1.5 py-1.5 gap-0.5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 px-2.5 pr-3 shrink-0 group">
          <div className="w-4 h-4 bg-[#884D70] rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm" />
          </div>
          <span className="text-gray-900 font-bold text-[11px] tracking-tight group-hover:text-[#884D70] transition-colors">
            EXIM
          </span>
        </Link>

        <div className="w-px h-3.5 bg-[#FFDBCB] shrink-0" />

        <div className="flex items-center gap-0.5 px-1.5">

          {/* Create / Update — sets section + navigates */}
          <Link
            href="/purchase-order"
            onClick={() => setActiveSection("createUpdate")}
            className={pill(activeSection === "createUpdate")}
          >
            Create / Update
          </Link>

          {/* White Label — sets section + navigates (NO dropdown) */}
          <Link
            href="/admin-management"
            onClick={() => setActiveSection("whiteLabel")}
            className={pill(activeSection === "whiteLabel")}
          >
            White Label
          </Link>

          {/* Reports */}
          <Link
            href="/reports"
            onClick={() => setActiveSection(null)}
            className={pill(pathname.startsWith("/reports"))}
          >
            Reports
          </Link>

          {/* Document Library */}
          <Link
            href="/document-library"
            onClick={() => setActiveSection(null)}
            className={pill(pathname.startsWith("/document-library"))}
          >
            Document Library
          </Link>

          {/* Masters */}
          <Link
            href="/masters"
            onClick={() => setActiveSection(null)}
            className={pill(pathname.startsWith("/masters"))}
          >
            Masters
          </Link>
        </div>

        <div className="w-px h-3.5 bg-[#FFDBCB] shrink-0" />

        {/* Bell */}
        <button className="p-1.5 mx-0.5 text-[#884D70]/50 hover:text-[#884D70] hover:bg-[#884D70]/10 rounded-full transition-colors">
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
        <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#884D70]/10 rounded-full transition-colors shrink-0">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
            S
          </div>
          <span className="text-[11px] text-[#884D70]/70">Shivam</span>
          <svg className="w-2.5 h-2.5 text-[#884D70]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
