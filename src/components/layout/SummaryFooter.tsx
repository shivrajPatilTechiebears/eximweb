export interface SummaryFooterItem {
  label: string;
  value: string;
}

interface SummaryFooterProps {
  leftItems?: SummaryFooterItem[];
  rightItems?: SummaryFooterItem[];
  total?: SummaryFooterItem;
}

function SummaryGroup({ items }: { items: SummaryFooterItem[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
      {items.map((item) => (
        <span key={item.label} className="text-label-caps text-on-surface-variant uppercase">
          {item.label}: <span className="text-primary font-bold">{item.value}</span>
        </span>
      ))}
    </div>
  );
}

export function SummaryFooter({
  leftItems = [],
  rightItems = [],
  total,
}: SummaryFooterProps) {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-low px-4 py-2 flex flex-wrap items-center justify-between gap-3">
      <SummaryGroup items={leftItems} />
      <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
        <SummaryGroup items={rightItems} />
        {total && (
          <>
            <div className="hidden sm:block h-4 w-px bg-outline-variant mx-1" />
            <span className="text-body-sm font-bold text-primary">
              {total.label}: {total.value}
            </span>
          </>
        )}
      </div>
    </footer>
  );
}
