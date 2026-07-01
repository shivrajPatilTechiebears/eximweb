import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingNavbar />
      <SecondaryNav />
      {children}
    </>
  );
}
