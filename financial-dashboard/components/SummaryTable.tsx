"use client";

import type { SummaryRow } from "@/app/data";

interface SummaryTableProps {
  data: SummaryRow[];
}

function getAmountClass(type?: SummaryRow["type"]) {
  switch (type) {
    case "positive":
      return "t-amount positive";
    case "negative":
      return "t-amount negative";
    default:
      return "t-amount text-foreground";
  }
}

/** Renders the P&L summary as transaction-style list (outline card context) */
export default function SummaryTable({ data }: SummaryTableProps) {
  return (
    <ul className="transaction-list flex flex-col gap-0">
      {data.map((row) => (
        <li
          key={row.metric}
          className="transaction-item flex items-baseline justify-between gap-8 border-b border-border-default/10 py-5 last:border-b-0"
        >
          <span className="t-name">{row.metric}</span>
          <span className={`flex-shrink-0 ${getAmountClass(row.type)}`}>
            {row.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
