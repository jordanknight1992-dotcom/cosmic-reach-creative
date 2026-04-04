interface SectionTagProps {
  label: string;
  className?: string;
}

export function SectionTag({ label, className = "" }: SectionTagProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-spark-red" />
      <span className="w-px h-4 bg-copper" />
      <span className="text-xs uppercase tracking-[0.2em] font-display font-semibold text-copper">
        {label}
      </span>
    </div>
  );
}
