"use client";

import type { MetricsRow } from "@/app/data";

interface MetricsTableProps {
  data: MetricsRow[];
}

function getValueClass(type?: MetricsRow["type"]) {
  switch (type) {
    case "positive":
      return "text-green-500 font-medium";
    case "negative":
      return "text-red-500 font-medium";
    default:
      return "text-slate-200";
  }
}

/** Renders performance metrics with Metric, Value, and Explanation columns */
export default function MetricsTable({ data }: MetricsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-600 bg-slate-800/50 shadow-lg">
      <table className="w-full min-w-[320px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-600 bg-slate-700/50">
            <th className="px-4 py-3 text-sm font-semibold text-slate-300">
              Metric
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-300 text-right whitespace-nowrap">
              Value
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-300 max-w-[280px]">
              Explanation
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.metric}
              className="border-b border-slate-700/80 transition-colors hover:bg-slate-700/30 last:border-b-0"
            >
              <td className="px-4 py-3 text-slate-200 align-top">
                {row.metric}
              </td>
              <td className={`px-4 py-3 text-right align-top whitespace-nowrap ${getValueClass(row.type)}`}>
                {row.value}
              </td>
              <td
                className="px-4 py-3 text-slate-400 text-sm max-w-[280px] align-top break-words"
                title={row.explanation}
              >
                {row.explanation}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
