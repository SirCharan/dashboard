"use client";

import { summaryData, metricsData } from "./data";
import SummaryTable from "@/components/SummaryTable";
import MetricsTable from "@/components/MetricsTable";
import KeyMetricCard from "@/components/KeyMetricCard";
import { WinLossPieChart, CumulativePnlChart } from "@/components/ChartsSection";

/** Heroicons-style SVGs (inline, no extra deps) */
function ChartBarIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}
function ScaleIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}

export default function DashboardPage() {
  const winRate = metricsData.find((m) => m.metric === "Win Rate %");
  const sharpe = metricsData.find((m) => m.metric === "Sharpe Ratio");
  const netPnl = summaryData.find((m) => m.metric === "Net P&L (after charges)");

  return (
    <div className="space-y-8">
      {/* Key metrics cards */}
      <section aria-labelledby="key-metrics-heading">
        <h2 id="key-metrics-heading" className="sr-only">
          Key metrics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KeyMetricCard
            title="Net P&L (after charges)"
            value={netPnl?.value ?? "—"}
            subtitle="Total profit after all charges"
            variant="positive"
            icon={<ChartBarIcon />}
          />
          <KeyMetricCard
            title="Win Rate"
            value={winRate?.value ?? "—"}
            subtitle={winRate?.explanation}
            variant="positive"
            icon={<TrophyIcon />}
          />
          <KeyMetricCard
            title="Sharpe Ratio"
            value={sharpe?.value ?? "—"}
            subtitle={sharpe?.explanation}
            variant="positive"
            icon={<ScaleIcon />}
          />
        </div>
      </section>

      {/* Charts row */}
      <section className="grid gap-6 md:grid-cols-2" aria-label="Charts">
        <div className="rounded-xl border border-slate-600 bg-slate-800/50 p-4 shadow-lg">
          <h3 className="mb-3 text-sm font-semibold text-slate-300">
            Win / Loss distribution
          </h3>
          <WinLossPieChart />
        </div>
        <div className="rounded-xl border border-slate-600 bg-slate-800/50 p-4 shadow-lg">
          <h3 className="mb-3 text-sm font-semibold text-slate-300">
            Cumulative P&L (sample)
          </h3>
          <CumulativePnlChart />
        </div>
      </section>

      {/* P&L Summary table */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="mb-4 text-lg font-semibold text-slate-200 md:text-xl">
          P&L Performance Summary
        </h2>
        <SummaryTable data={summaryData} />
      </section>

      {/* Performance Metrics table */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="mb-4 text-lg font-semibold text-slate-200 md:text-xl">
          Performance Metrics
        </h2>
        <MetricsTable data={metricsData} />
      </section>
    </div>
  );
}
