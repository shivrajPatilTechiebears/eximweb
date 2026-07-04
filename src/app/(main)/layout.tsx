import { Navbar } from "@/components/layout/Navbar";
import { DashboardHeaderProvider, DashboardHeaderSlot } from "@/components/layout/PageHeader";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardHeaderProvider>
      <Navbar />
      <div className="min-h-screen flex flex-col antialiased text-slate-800">
        <DashboardHeaderSlot />
        {children}
      </div>
    </DashboardHeaderProvider>
  );
}
