"use client";

import type { SummaryRow } from "@/app/data";

interface SummaryTableProps {
  data: SummaryRow[];
}

/** Renders the P&L summary as a clean two-column table with color-coded values */
function getValueClass(type?: SummaryRow["type"]) {
  switch (type) {
    case "positive":
      return "text-green-500 font-medium";
    case "negative":
      return "text-red-500 font-medium";
    default:
      return "text-slate-200";
  }
}

export default function SummaryTable({ data }: SummaryTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-600 bg-slate-800/50 shadow-lg">
      <table className="w-full min-w-[280px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-600 bg-slate-700/50">
            <th className="px-4 py-3 text-sm font-semibold text-slate-300">
              Metric
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-right">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.metric}
              className="border-b border-slate-700/80 transition-colors hover:bg-slate-700/30 last:border-b-0"
            >
              <td className="px-4 py-3 text-slate-200">{row.metric}</td>
              <td className={`px-4 py-3 text-right ${getValueClass(row.type)}`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
