# Project Summary: Zerodha F&O P&L Analyzer

## Executive Summary

The Zerodha F&O P&L Analyzer is a comprehensive trading performance analysis tool designed to process Zerodha Futures & Options P&L Excel exports and generate detailed performance reports with visualizations. The project provides multiple interfaces (CLI, web app, and React dashboard) for analyzing trading performance.

## Project Components

### 1. Python Analysis Engine (`trade_analyzer/`)

**Purpose**: Core backend that processes Zerodha Excel files and computes trading metrics.

**Key Features**:
- Intelligent Excel parsing with header detection
- Comprehensive metric calculation (Sharpe, Sortino, drawdown, CAGR, etc.)
- Automated visualization generation (cumulative P&L, win/loss charts, histograms)
- Markdown report generation

**Main File**: `trade_analyzer.py` (596 lines)
- `load_data()` - Parses Zerodha Excel format
- `compute_metrics()` - Calculates 20+ performance metrics
- `generate_plots()` - Creates matplotlib visualizations
- `generate_report()` - Generates Markdown reports

**Dependencies**: pandas, numpy, matplotlib, seaborn, openpyxl

### 2. Streamlit Web Interface (`trade_analyzer/frontend/`)

**Purpose**: Interactive web application for file upload and analysis.

**Features**:
- Drag-and-drop file upload
- Configurable parameters (initial capital, risk-free rate)
- Inline report and plot display
- User-friendly interface

**Main File**: `app.py` (64 lines)

### 3. Next.js Dashboard (`financial-dashboard/`)

**Purpose**: Modern React dashboard for visualizing trading metrics.

**Features**:
- Responsive dark-themed UI
- Key metric cards (Net P&L, Win Rate, Sharpe Ratio)
- Interactive charts (Recharts)
- Detailed performance tables
- TypeScript for type safety

**Tech Stack**: Next.js 16, React 18, TypeScript, Tailwind CSS, Recharts

## Key Metrics Calculated

### Financial Summary
- Total Realized/Unrealized P&L
- Total Charges and Credits/Debits
- Net P&L (after charges)
- Portfolio Value

### Trading Statistics
- Total Trades, Win Rate, Win/Loss Ratio
- Average Win/Loss, Expectancy
- Profit Factor

### Risk Metrics
- Sharpe Ratio (risk-adjusted return)
- Sortino Ratio (downside risk-adjusted)
- Maximum Drawdown
- CAGR (Compounded Annual Growth Rate)
- Average Trade Duration

## Visualizations

1. **Cumulative P&L Chart** - Profit progression over time
2. **Win/Loss Pie Chart** - Distribution of winning vs losing trades
3. **P&L Histogram** - Distribution of individual trade P&L values

## Project Statistics

- **Total Lines of Code**: ~800+ (Python) + ~500+ (TypeScript/React)
- **Components**: 3 main modules (CLI, Streamlit, Dashboard)
- **Dependencies**: 7 Python packages, 10+ npm packages
- **Output Formats**: Markdown reports, PNG visualizations

## Current Capabilities

✅ Parse Zerodha F&O Excel exports  
✅ Calculate 20+ performance metrics  
✅ Generate visualizations  
✅ CLI, web app, and dashboard interfaces  
✅ Handle variable Excel formats  
✅ Extract dates from F&O symbols  

## Technical Highlights

- **Robust Parsing**: Handles variable header positions in Zerodha exports
- **Date Inference**: Extracts trade dates from F&O symbol names (e.g., "25JUL24")
- **Risk Metrics**: Properly annualized Sharpe/Sortino ratios using trade-level returns
- **Error Handling**: Graceful fallbacks for edge cases
- **Type Safety**: TypeScript in frontend, type hints in Python

## Usage Workflow

1. **Export P&L**: Download F&O P&L Excel from Zerodha
2. **Analyze**: Run CLI or upload via Streamlit
3. **Review**: View generated report and plots
4. **Visualize**: Open dashboard for interactive charts

## File Structure Summary

```
zerodjha/
├── trade_analyzer/          # Python backend (CLI + Streamlit)
│   ├── trade_analyzer.py   # Core engine
│   └── frontend/app.py      # Web interface
├── financial-dashboard/     # Next.js React dashboard
│   ├── app/                # Pages and layouts
│   └── components/         # React components
├── plots/                  # Generated visualizations
├── report.md              # Generated reports
└── Documentation files     # README, AGENTS, summary
```

## Sample Output

The analyzer generates reports with:
- Performance summary tables
- Detailed metrics with explanations
- Visual charts and graphs
- Formatted Markdown output

**Example Metrics** (from sample data):
- Total Realized P&L: ₹1,251,746.50
- Win Rate: 72.92%
- Sharpe Ratio: 2.29
- Sortino Ratio: 5.98
- Max Drawdown: -18.07%
- Total Return: 85.36%

## Future Enhancements

Potential improvements:
- API integration with Zerodha
- Database storage for historical tracking
- Multi-file comparison
- PDF/Excel export
- Real-time data updates
- Advanced filtering and analysis

## Development Status

✅ Core analyzer complete  
✅ Streamlit interface functional  
✅ Dashboard UI implemented  
⚠️ Dashboard uses hardcoded data (needs API integration)  
⚠️ No authentication/security layer  

## Getting Started

See `README.md` for installation and usage instructions.

---

**Project Type**: Trading Analysis Tool  
**Primary Language**: Python (backend), TypeScript (frontend)  
**License**: See repository  
**Last Updated**: February 2026
