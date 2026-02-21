interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "url" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  options,
  value,
  onChange,
  error,
}: FormFieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const baseInputClasses =
    "w-full px-4 py-3 rounded-[var(--radius-sm)] bg-deep-space border text-starlight placeholder:text-muted/60 text-sm focus:outline-none focus:border-spark-red transition-colors duration-200";
  const borderClass = error ? "border-spark-red" : "border-border";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-starlight mb-2">
        {label}
        {required && <span className="text-spark-red ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`${baseInputClasses} ${borderClass} resize-y`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      ) : type === "select" && options ? (
        <select
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClasses} ${borderClass}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        >
          <option value="">{placeholder || "Select..."}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInputClasses} ${borderClass}`}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      {error && (
        <p id={errorId} className="mt-1 text-spark-red text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
