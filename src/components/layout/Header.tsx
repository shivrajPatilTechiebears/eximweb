"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

// ── Static config ─────────────────────────────────────────────────────────────

const USER_NAME = "Shivam Chaudhari";
const USER_ROLE = "Analytics Lead";

const NOTIFICATIONS = [
  {
    id: "1",
    icon: "local_shipping",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "PO-2024-004 Shipped",
    body: "Global Supply Chain dispatched your order.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    icon: "warning",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "PO-2024-002 Delayed",
    body: "Zenth Global Logistics reported a delay.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: "3",
    icon: "check_circle",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Invoice #INV-0091 Approved",
    body: "Finance team approved and processed.",
    time: "3 hr ago",
    unread: false,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const initial = USER_NAME.charAt(0).toUpperCase();
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !readIds.has(n.id)).length;

  const markAllRead = () => setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)));

  return (
    <header className="flex items-center justify-between px-6 h-14 bg-white border-b border-slate-100 flex-shrink-0">
      <h1 className="text-lg font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-md transition-shadow"
          >
            <Icon name="notifications" className="text-gray-600 text-[20px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-gray-50">
                {NOTIFICATIONS.map((n) => {
                  const isUnread = n.unread && !readIds.has(n.id);
                  return (
                    <button
                      key={n.id}
                      onClick={() => setReadIds((prev) => new Set([...prev, n.id]))}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${isUnread ? "bg-blue-50/40" : ""}`}
                    >
                      <div className={`${n.iconBg} p-1.5 rounded-lg flex-shrink-0 mt-0.5`}>
                        <Icon name={n.icon} className={`${n.iconColor} text-[16px]`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{n.body}</p>
                      </div>
                      {isUnread && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100 text-center">
                <button className="text-xs text-blue-500 font-semibold hover:text-blue-700 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User info + avatar */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-gray-900 leading-none">{USER_NAME}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{USER_ROLE}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
