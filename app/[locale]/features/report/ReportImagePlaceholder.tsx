type ReportImagePlaceholderProps = {
  aspectClassName: string;
  label: string;
  className?: string;
};

export default function ReportImagePlaceholder({
  aspectClassName,
  label,
  className = "",
}: ReportImagePlaceholderProps) {
  return (
    <div
      className={`w-full ${aspectClassName} border border-foreground/30 bg-foreground/10 flex items-center justify-center text-[11px] md:text-xs text-foreground/70 ${className}`.trim()}
      aria-label={label}
    >
      <span>{label}</span>
    </div>
  );
}
