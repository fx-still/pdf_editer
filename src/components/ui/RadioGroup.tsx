"use client";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function RadioGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="grid gap-2">
      {options.map((opt) => {
        const checked = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cx(
              "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition",
              checked
                ? "border-white/25 bg-white/10 text-zinc-50"
                : "border-white/10 bg-white/0 text-zinc-200 hover:bg-white/5"
            )}
          >
            <span>{opt.label}</span>
            <span
              className={cx(
                "inline-flex h-4 w-4 items-center justify-center rounded-full border",
                checked ? "border-white/60" : "border-white/20"
              )}
            >
              {checked ? (
                <span className="h-2 w-2 rounded-full bg-white" />
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

