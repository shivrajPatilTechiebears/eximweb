interface SectionHeadingProps {
  title: string;
  description?: string;
}

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div>
      <h3 className="font-headline-md text-sm text-on-surface">{title}</h3>
      {description && (
        <p className="text-[11px] text-on-surface-variant">{description}</p>
      )}
    </div>
  );
}
