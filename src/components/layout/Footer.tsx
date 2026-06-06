import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="py-2 flex justify-center text-on-surface-variant/30 select-none">
      <Icon name="security" className="text-[10px] mr-1" />
      <span className="font-label-caps text-[8px] uppercase tracking-[2px]">
        Secure Protocol v2.4
      </span>
    </footer>
  );
}
