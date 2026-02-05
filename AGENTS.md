# Agent Instructions for Zerodha P&L Analyzer

This document provides guidance for AI agents working on this codebase.

## Project Overview

This is a trading performance analysis tool for Zerodha F&O (Futures & Options) P&L statements. The project has three main components:
1. Python CLI analyzer (`trade_analyzer/`)
2. Streamlit web interface (`trade_analyzer/frontend/`)
3. Next.js React dashboard (`financial-dashboard/`)

## Project Structure

```
zerodjha/
├── trade_analyzer/           # Python backend
│   ├── trade_analyzer.py    # Core analysis engine (CLI)
│   ├── frontend/app.py      # Streamlit web app
│   └── requirements.txt     # Python deps
├── financial-dashboard/      # Next.js frontend
│   ├── app/                 # Next.js app router
│   └── components/          # React components
├── plots/                   # Generated visualizations
├── report.md               # Generated report output
└── read_pnl.py            # Utility script
```

## Key Files and Their Purposes

### Python Backend

- **`trade_analyzer/trade_analyzer.py`** (596 lines)
  - Main analysis engine
  - Functions: `load_data()`, `compute_metrics()`, `generate_plots()`, `generate_report()`
  - Handles Zerodha Excel parsing, metric calculation, visualization
  - CLI entry point with argparse

- **`trade_analyzer/frontend/app.py`** (64 lines)
  - Streamlit web interface
  - File upload, parameter input, report display
  - Uses core analyzer functions

### Frontend Dashboard

- **`financial-dashboard/app/page.tsx`** - Main dashboard page
- **`financial-dashboard/app/data.ts`** - Hardcoded data (can be replaced with API)
- **`financial-dashboard/components/`** - Reusable React components

### Utilities

- **`read_pnl.py`** - Simple Excel reader utility
- **`report.md`** - Generated output (do not edit manually)

## Coding Conventions

### Python
- Use type hints (`->`, `Optional`, `Dict`, etc.)
- Follow PEP 8 style
- Use dataclasses for structured data (`@dataclass`)
- Error handling: graceful fallbacks for parsing edge cases
- Docstrings for public functions

### TypeScript/React
- Use TypeScript strict mode
- Functional components with hooks
- Tailwind CSS for styling
- Dark theme by default
- Accessibility: semantic HTML, ARIA labels

## Important Patterns

### Data Flow
1. Excel file → `load_data()` → cleaned DataFrame
2. DataFrame → `compute_metrics()` → Metrics dataclass
3. DataFrame + Metrics → `generate_plots()` → image files
4. Metrics + plots → `generate_report()` → Markdown file

### Excel Parsing
- Zerodha exports have variable header positions
- `detect_header_row()` finds the table start
- Summary data (charges, dates) extracted from header rows
- Numeric columns cleaned (remove commas, non-numeric chars)

### Metric Calculations
- Risk-adjusted metrics (Sharpe, Sortino) use trade-level returns
- Annualization accounts for actual trading period
- Drawdown calculated on cumulative P&L
- Dates inferred from F&O symbol names (e.g., "25JUL24")

## Common Tasks

### Adding a New Metric
1. Add field to `Metrics` dataclass in `trade_analyzer.py`
2. Calculate in `compute_metrics()` function
3. Add to report table in `generate_report()`
4. Optionally add to dashboard `data.ts` and display component

### Modifying Visualizations
- Plot generation in `generate_plots()` function
- Uses matplotlib/seaborn
- Saves to `plots/` directory
- Dashboard uses Recharts in `ChartsSection.tsx`

### Updating Dashboard Data
- Currently uses hardcoded `app/data.ts`
- Can be replaced with API call or file upload
- Components expect specific data shapes (see `SummaryTable`, `MetricsTable`)

## Dependencies

### Python
- pandas, numpy (data processing)
- matplotlib, seaborn (visualization)
- openpyxl (Excel reading)
- streamlit (web interface)

### Node.js
- next, react, react-dom (framework)
- recharts (charts)
- tailwindcss (styling)
- typescript (type safety)

## Testing Considerations

- Test with various Zerodha Excel formats (header positions vary)
- Handle edge cases: empty files, missing columns, invalid dates
- Verify metric calculations against known values
- Check plot generation with different data sizes

## File Modification Guidelines

- **DO NOT** manually edit `report.md` - it's generated
- **DO NOT** commit generated plots unless necessary
- **DO** update README.md when adding features
- **DO** update this file (AGENTS.md) when architecture changes

## Common Issues

1. **Excel parsing fails**: Check header detection logic, may need to adjust `detect_header_row()`
2. **Metrics show NaN**: Check for division by zero, insufficient data points
3. **Dates not detected**: Symbol parsing may fail for non-standard formats
4. **Dashboard not updating**: Check `data.ts` is being imported correctly

## Future Enhancements

- API endpoint to connect dashboard with analyzer
- Database storage for historical analysis
- Multiple file comparison
- Export to PDF/Excel
- Real-time data integration with Zerodha API

## Environment Setup

```bash
# Python
python -m venv .venv
source .venv/bin/activate
pip install -r trade_analyzer/requirements.txt

# Node.js
cd financial-dashboard
npm install
```

## Running Components

```bash
# CLI
python trade_analyzer/trade_analyzer.py --file <path> --capital 100000

# Streamlit
streamlit run trade_analyzer/frontend/app.py

# Dashboard
cd financial-dashboard && npm run dev
```

---

**Last Updated**: 2026-02-05
**Maintainer**: See repository contributors
