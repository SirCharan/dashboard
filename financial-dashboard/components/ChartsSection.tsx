"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { winLossChartData, cumulativePnlChartData } from "@/app/data";

/** Simple bar chart with divs (height %) - for dark card */
export function WinLossBarChart() {
  const total = winLossChartData.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex h-[120px] w-full items-end gap-2 px-2">
      {winLossChartData.map((d) => (
        <div key={d.name} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full min-h-[4px] rounded-t transition-all"
            style={{
              height: `${Math.max(4, (d.value / total) * 100)}%`,
              backgroundColor: d.color,
            }}
            title={`${d.name}: ${d.value}`}
          />
          <span className="t-meta text-xs text-white/70">{d.name}</span>
        </div>
      ))}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "rgba(15, 15, 15, 0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  color: "#fff",
};

/** Win/Loss pie chart - styled for dark card. compact = small donut for allocation card */
export function WinLossPieChart({ compact }: { compact?: boolean }) {
  const size = compact ? 140 : 280;
  const innerR = compact ? 45 : 60;
  const outerR = compact ? 65 : 90;
  return (
    <div className="w-full" style={{ height: compact ? 160 : 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={winLossChartData}
            cx="50%"
            cy="50%"
            innerRadius={innerR}
            outerRadius={outerR}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={compact ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {winLossChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {!compact && (
            <>
              <Tooltip
                formatter={(value: number) => [`${value} trades`, "Count"]}
                contentStyle={tooltipStyle}
              />
              <Legend wrapperStyle={{ color: "#fff" }} />
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Cumulative P&L area chart - simple SVG area, styled for dark card */
export function CumulativePnlChart() {
  const formatPnl = (v: number) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(2)}M` : `${(v / 1e3).toFixed(0)}k`;

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={cumulativePnlChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
          <XAxis
            dataKey="trade"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            label={{ value: "Trade #", position: "insideBottom", offset: -5, fill: "rgba(255,255,255,0.6)" }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
            tickFormatter={formatPnl}
          />
          <Tooltip
            formatter={(value: number) => [formatPnl(value), "Cumulative P&L"]}
            contentStyle={tooltipStyle}
            labelFormatter={(label) => `Trade ${label}`}
          />
          <Area
            type="monotone"
            dataKey="pnl"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#pnlGradient)"
            name="Cumulative P&L"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
