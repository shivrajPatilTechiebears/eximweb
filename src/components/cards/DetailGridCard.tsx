import { Badge, type BadgeVariant } from "@/components/ui/Badge";

export interface DetailGridItem {
  label: string;
  value: string;
  wide?: boolean;
  badgeVariant?: BadgeVariant;
  badgeUppercase?: boolean;
}

interface DetailGridCardProps {
  items: DetailGridItem[];
  className?: string;
}

export function DetailGridCard({ items, className }: DetailGridCardProps) {
  return (
    <section
      className={`bg-white/80 border border-white rounded-xl p-4 shadow-sm${className ? ` ${className}` : ""}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className={
              item.wide
                ? "md:col-span-2 xl:col-span-4 flex flex-col mt-1 pt-2 border-t border-gray-100"
                : "flex flex-col"
            }
          >
            <span className="text-label-caps font-label-caps text-on-surface-variant uppercase">
              {item.label}
            </span>
            {item.badgeVariant ? (
              <Badge
                variant={item.badgeVariant}
                label={item.value}
                size="sm"
                uppercase={item.badgeUppercase ?? false}
                className="w-fit"
              />
            ) : (
              <span className="text-body-sm font-semibold text-on-surface">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
