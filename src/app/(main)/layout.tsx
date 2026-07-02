import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { DashboardHeaderProvider, DashboardHeaderSlot } from "@/components/layout/PageHeader";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardHeaderProvider>
      <FloatingNavbar />
      <SecondaryNav />
      <div className="min-h-screen flex flex-col antialiased text-slate-800">
        <DashboardHeaderSlot />
        {children}
      </div>
    </DashboardHeaderProvider>
  );
}
