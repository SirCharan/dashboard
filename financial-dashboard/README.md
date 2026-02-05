# Trading Performance Dashboard

A single-page Next.js dashboard that displays P&L and performance metrics from a trading report. Data is hardcoded (no file upload or backend).

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (Win/Loss pie chart, Cumulative P&L area chart)

## Project structure

```
financial-dashboard/
├── app/
│   ├── layout.tsx      # Root layout (header, main, footer)
│   ├── page.tsx        # Main dashboard page
│   ├── globals.css     # Global styles
│   └── data.ts         # Hardcoded report data
├── components/
│   ├── SummaryTable.tsx    # P&L summary table
│   ├── MetricsTable.tsx    # Metrics (Metric, Value, Explanation)
│   ├── KeyMetricCard.tsx   # Highlight cards (e.g. Win Rate, Sharpe)
│   └── ChartsSection.tsx   # Recharts (pie + area)
├── public/                 # Static assets (optional)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## How to run

```bash
cd financial-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard is responsive and uses a dark theme by default.

## Features

- **Summary table**: Total Realized P&L, Unrealized P&L, Charges, Net P&L, Portfolio Value (green/red for positive/negative).
- **Metrics table**: Total Trades, Win Rate, Sharpe, Sortino, Max Drawdown, etc., with explanation column and tooltips.
- **Key metric cards**: Net P&L, Win Rate, Sharpe Ratio with simple icons.
- **Charts**: Win/Loss pie chart and cumulative P&L area chart (sample data).
- **Accessibility**: Semantic HTML, section headings, ARIA where useful.

## Extending later

- **File upload**: Add an API route or client-side parser to read `report.md` (or CSV/JSON) and replace the hardcoded `app/data.ts` with dynamic state.
- **Backend**: Replace `data.ts` with `fetch()` from your API; keep the same component props.
- **Light mode**: Toggle `class="dark"` on `<html>` and add light theme variables in `globals.css` (e.g. under `:root.light`).

## Notes

- Numbers are formatted with commas; negatives and drawdowns are shown in red, positives in green.
- No authentication or global state (e.g. Redux) is used.
