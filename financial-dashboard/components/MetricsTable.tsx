"use client";

import type { MetricsRow } from "@/app/data";

interface MetricsTableProps {
  data: MetricsRow[];
}

function getAmountClass(type?: MetricsRow["type"]) {
  switch (type) {
    case "positive":
      return "t-amount positive";
    case "negative":
      return "t-amount negative";
    default:
      return "t-amount text-foreground";
  }
}

/** Renders performance metrics as transaction-style list (outline card context) */
export default function MetricsTable({ data }: MetricsTableProps) {
  return (
    <ul className="transaction-list flex flex-col gap-0">
      {data.map((row) => (
        <li
          key={row.metric}
          className="transaction-item flex flex-col gap-1 border-b border-border-default/10 px-0 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 last:border-b-0"
        >
          <div className="min-w-0 flex-1">
            <span className="t-name block">{row.metric}</span>
            <span className="t-meta mt-0.5 block" title={row.explanation}>
              {row.explanation}
            </span>
          </div>
          <span className={`mt-1 flex-shrink-0 sm:mt-0 sm:text-right ${getAmountClass(row.type)}`}>
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
