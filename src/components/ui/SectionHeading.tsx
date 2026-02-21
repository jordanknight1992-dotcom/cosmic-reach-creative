interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 md:mb-16 ${
        align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"
      }`}
    >
      {label && (
        <p className="text-spark-red font-display font-semibold text-sm tracking-wide uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-starlight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted text-lg leading-relaxed">{description}</p>
      )}
    </div>
  );
}
