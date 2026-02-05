"use client";

import type { ReactNode } from "react";

interface KeyMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}

const valueColorClass = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-foreground",
};

/** Highlights a single key metric in a dark overlay card with optional icon */
export default function KeyMetricCard({
  title,
  value,
  subtitle,
  variant = "neutral",
  icon,
}: KeyMetricCardProps) {
  return (
    <div
      className="card dark p-5 transition-opacity hover:opacity-95"
      title={subtitle}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="label">{title.toLowerCase()}</p>
          <p className={`value-lg mt-1 truncate ${valueColorClass[variant]}`}>{value}</p>
          {subtitle && (
            <p className="t-meta mt-1 line-clamp-2 text-white/70">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-lg bg-white/10 p-2 text-white">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
