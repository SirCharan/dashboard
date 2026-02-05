/**
 * Hardcoded report data extracted from report.md
 * Used by the Trading Performance Dashboard
 */

export interface SummaryRow {
  metric: string;
  value: string;
  /** Whether value is positive/negative for styling (P&L, credits/debits) */
  type?: "positive" | "negative" | "neutral";
}

export interface MetricsRow {
  metric: string;
  value: string;
  explanation: string;
  type?: "positive" | "negative" | "neutral";
}

/** P&L Performance Summary table */
export const summaryData: SummaryRow[] = [
  { metric: "Total Realized P&L", value: "1,251,746.50", type: "positive" },
  { metric: "Total Unrealized P&L", value: "38,975.00", type: "positive" },
  { metric: "Total Charges", value: "10,380.60", type: "neutral" },
  { metric: "Other Credits/Debits", value: "-11.80", type: "negative" },
  { metric: "Net P&L (after charges)", value: "1,280,329.10", type: "positive" },
  { metric: "Portfolio Value", value: "2,780,329.10", type: "neutral" },
];

/** Performance Metrics table (Metric, Value, Explanation) */
export const metricsData: MetricsRow[] = [
  { metric: "Total Trades", value: "48", explanation: "Number of trades with non-zero realized P&L", type: "neutral" },
  { metric: "Winning Trades", value: "35", explanation: "Trades with positive realized P&L", type: "positive" },
  { metric: "Losing Trades", value: "13", explanation: "Trades with negative realized P&L", type: "negative" },
  { metric: "Breakeven Trades", value: "0", explanation: "Trades with zero realized P&L", type: "neutral" },
  { metric: "Win Rate %", value: "72.92%", explanation: "Winning trades / total trades", type: "positive" },
  { metric: "Average Win", value: "46,038.99", explanation: "Mean P&L of winning trades", type: "positive" },
  { metric: "Average Loss", value: "-27,662.92", explanation: "Mean P&L of losing trades (negative)", type: "negative" },
  { metric: "Win/Loss Ratio", value: "1.66", explanation: "Average win / average loss (abs)", type: "positive" },
  { metric: "Expectancy", value: "26,078.05", explanation: "Expected P&L per trade", type: "positive" },
  { metric: "Profit Factor", value: "4.48", explanation: "Total profits / total losses", type: "positive" },
  { metric: "Total Return %", value: "85.36%", explanation: "Net P&L / initial capital", type: "positive" },
  { metric: "Sharpe Ratio", value: "2.29", explanation: "Risk-adjusted return (all volatility)", type: "positive" },
  { metric: "Sortino Ratio", value: "5.98", explanation: "Risk-adjusted return (downside volatility only)", type: "positive" },
  { metric: "Max Drawdown %", value: "-18.07%", explanation: "Max peak-to-trough decline on cumulative P&L", type: "negative" },
  { metric: "CAGR", value: "143%", explanation: "Compounded annual growth rate (approx)", type: "positive" },
  { metric: "Avg Trade Duration (days)", value: "5.19", explanation: "Approx. period / total trades", type: "neutral" },
];

/** Win/Loss counts for pie chart */
export const winLossChartData = [
  { name: "Wins", value: 35, color: "#22c55e" },
  { name: "Losses", value: 13, color: "#ef4444" },
];

/** Sample cumulative P&L for bar/area chart (simplified trend) */
export const cumulativePnlChartData = [
  { trade: 0, pnl: 0 },
  { trade: 5, pnl: 120000 },
  { trade: 10, pnl: 280000 },
  { trade: 15, pnl: 420000 },
  { trade: 20, pnl: 580000 },
  { trade: 25, pnl: 720000 },
  { trade: 30, pnl: 920000 },
  { trade: 35, pnl: 1080000 },
  { trade: 40, pnl: 1180000 },
  { trade: 45, pnl: 1230000 },
  { trade: 48, pnl: 1251746.5 },
];
