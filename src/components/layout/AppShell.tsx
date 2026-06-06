import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SIDEBAR_CONFIG, getNavSections } from "@/config/navigation";

interface AppShellProps {
  title: string;
  userName: string;
  userRole: string;
  /** Label of the nav item to mark active. Defaults to "Purchase order". */
  activeNavLabel?: string;
  children: React.ReactNode;
}

export function AppShell({
  title,
  userName,
  userRole,
  activeNavLabel = "Purchase order",
  children,
}: AppShellProps) {
  return (
    <div className="bg-background text-on-background text-sm">
      <Sidebar {...SIDEBAR_CONFIG} sections={getNavSections(activeNavLabel)} />
      <div className="ml-[240px] flex flex-col min-h-screen">
        <Header title={title} userName={userName} userRole={userRole} />
        {children}
      </div>
    </div>
  );
}
