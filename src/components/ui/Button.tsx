"use client";

import Link from "next/link";
import { forwardRef } from "react";

type Variant = "primary" | "ghost";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-white text-zinc-950 hover:bg-zinc-200",
  ghost: "bg-white/0 text-zinc-100 hover:bg-white/10",
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "primary", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cx(base, variants[variant], className)}
      {...props}
    />
  );
});

export function ButtonLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={cx(base, variants.primary, className)} href={href}>
      {children}
    </Link>
  );
}

