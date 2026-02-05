"use client";

import type { ReactNode } from "react";

interface KeyMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}

const variantStyles = {
  positive: "border-green-500/30 bg-green-500/5 text-green-400",
  negative: "border-red-500/30 bg-red-500/5 text-red-400",
  neutral: "border-slate-500/30 bg-slate-500/5 text-slate-300",
};

/** Highlights a single key metric in a card with optional icon */
export default function KeyMetricCard({
  title,
  value,
  subtitle,
  variant = "neutral",
  icon,
}: KeyMetricCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] ${variantStyles[variant]}`}
      title={subtitle}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-1 truncate text-2xl font-bold md:text-3xl">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-lg bg-slate-700/50 p-2">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
