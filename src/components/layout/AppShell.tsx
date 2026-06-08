import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  title: string;
  activeNavLabel?: string;
  children: React.ReactNode;
}

export function AppShell({ title, activeNavLabel = "Purchase order", children }: AppShellProps) {
  return (
    <div className="h-screen overflow-hidden text-sm text-on-background">
      <Sidebar activeNavLabel={activeNavLabel} />

      <div className="ml-[240px] h-full flex flex-col">
        <Header title={title} />

        <div className="flex-1 min-h-0 mx-3 mb-3 mt-2 rounded-[28px] bg-white/70 backdrop-blur-sm overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          {children}
        </div>
      </div>
    </div>
  );
}
