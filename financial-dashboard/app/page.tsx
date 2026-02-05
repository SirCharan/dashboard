"use client";

import { summaryData, metricsData } from "./data";
import SummaryTable from "@/components/SummaryTable";
import MetricsTable from "@/components/MetricsTable";
import KeyMetricCard from "@/components/KeyMetricCard";
import { WinLossPieChart, CumulativePnlChart } from "@/components/ChartsSection";

/** Mini sparkline for dark card (reference-style SVG) */
function MiniSparkline() {
  return (
    <div className="chart-container mt-4 flex h-[60px] w-full items-end">
      <svg
        viewBox="0 0 300 60"
        preserveAspectRatio="none"
        className="h-full w-full"
        style={{ stroke: "currentColor", fill: "none" }}
      >
        <path
          d="M0,50 Q30,45 60,30 T120,40 T180,20 T240,35 T300,10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M0,50 Q30,45 60,30 T120,40 T180,20 T240,35 T300,10 V60 H0 Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="none"
        />
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const winRate = metricsData.find((m) => m.metric === "Win Rate %");
  const sharpe = metricsData.find((m) => m.metric === "Sharpe Ratio");
  const netPnl = summaryData.find((m) => m.metric === "Net P&L (after charges)");

  return (
    <div
      id="overview"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:grid-auto-rows-[minmax(150px,auto)] lg:gap-6"
    >
      {/* Hero – ghost span-2 */}
      <div className="card ghost px-6 py-6 lg:col-span-2 sm:px-8 sm:py-8">
        <h1 className="mb-2 text-[2rem] font-medium tracking-tight">financial overview</h1>
        <p className="max-w-[400px] text-muted">
          Financial overview of Stocky AI&apos;s performance from 1st June 2025 to today.
        </p>
      </div>

      {/* Net P&L hero – dark span-2 with value-lg + sparkline */}
      <div className="card dark flex flex-col justify-between px-6 py-6 lg:col-span-2 sm:px-8 sm:py-8">
        <div>
          <span className="label">net p&l (after charges)</span>
          <span className="value-lg block text-white">
            {netPnl?.value ?? "—"}
          </span>
          <span className="label mt-2 block text-white/50">total realized after all charges</span>
        </div>
        <MiniSparkline />
      </div>

      {/* Allocation – outline row-2 (win/loss as allocation) */}
      <div className="card outline px-6 py-6 lg:row-span-2 sm:px-8 sm:py-8">
        <span className="label">allocation</span>
        <div className="mt-6 flex flex-1 flex-col items-center justify-center">
          <WinLossPieChart compact />
        </div>
        <ul className="transaction-list mt-6 space-y-3 border-t border-border-default/20 pt-6">
          <li className="flex justify-between text-sm">
            <span className="t-meta">wins</span>
            <span className="t-amount positive">72.9%</span>
          </li>
          <li className="flex justify-between text-sm">
            <span className="t-meta">losses</span>
            <span className="t-amount negative">27.1%</span>
          </li>
        </ul>
      </div>

      {/* P&L Summary – outline span-2 row-2 (recent activity style) */}
      <div id="summary" className="card outline px-6 py-6 lg:col-span-2 lg:row-span-2 sm:px-8 sm:py-8">
        <span className="label">p&l performance summary</span>
        <div className="mt-6 flex-1">
          <SummaryTable data={summaryData} />
        </div>
      </div>

      {/* Key metrics – outline cards (SPX/NASDAQ style) */}
      <div className="card outline px-6 py-6 sm:px-8 sm:py-8">
        <span className="label">win rate</span>
        <span className="value">{winRate?.value ?? "—"}</span>
        <div className="chart-container mt-6 flex flex-1 items-end gap-1">
          {[40, 70, 50, 90, 60, 80].map((h, i) => (
            <div
              key={i}
              className="bar flex-1 bg-foreground opacity-20 transition-opacity hover:opacity-100"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="card outline px-6 py-6 sm:px-8 sm:py-8">
        <span className="label">sharpe ratio</span>
        <span className="value">{sharpe?.value ?? "—"}</span>
        <div className="chart-container mt-6 flex flex-1 items-end gap-1">
          {[30, 50, 40, 60, 55, 75].map((h, i) => (
            <div
              key={i}
              className="bar flex-1 bg-foreground opacity-20 transition-opacity hover:opacity-100"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Charts row */}
      <section id="charts" className="card outline px-6 py-6 lg:col-span-4 sm:px-8 sm:py-8" aria-label="Charts">
        <span className="label">win / loss distribution</span>
        <div className="mt-6 h-[280px]">
          <WinLossPieChart />
        </div>
      </section>
      <div className="card outline px-6 py-6 lg:col-span-4 sm:px-8 sm:py-8">
        <span className="label">cumulative p&l (sample)</span>
        <div className="mt-6 h-[260px]">
          <CumulativePnlChart />
        </div>
      </div>

      {/* Performance metrics – full width */}
      <section id="metrics" className="card outline lg:col-span-4 px-6 py-6 sm:px-8 sm:py-8">
        <span className="label">performance metrics</span>
        <div className="mt-6">
          <MetricsTable data={metricsData} />
        </div>
      </section>
    </div>
  );
}
