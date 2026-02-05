# Zerodha F&O P&L Analyzer

A comprehensive trading performance analysis tool for Zerodha F&O (Futures & Options) P&L statements. This project provides multiple interfaces to analyze trading performance, generate detailed reports, and visualize key metrics.

## 🎯 Overview

This project consists of three main components:
1. **Python CLI Analyzer** - Core analysis engine that processes Zerodha Excel exports
2. **Streamlit Web App** - Interactive web interface for file upload and analysis
3. **Next.js Dashboard** - Modern React dashboard for visualizing trading metrics

## 📁 Project Structure

```
zerodjha/
├── trade_analyzer/              # Python analysis engine
│   ├── trade_analyzer.py       # Main CLI script
│   ├── frontend/
│   │   └── app.py              # Streamlit web interface
│   ├── requirements.txt        # Python dependencies
│   └── README.md               # Trade analyzer documentation
│
├── financial-dashboard/        # Next.js React dashboard
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── data.ts            # Hardcoded report data
│   ├── components/             # React components
│   │   ├── SummaryTable.tsx   # P&L summary table
│   │   ├── MetricsTable.tsx   # Performance metrics table
│   │   ├── KeyMetricCard.tsx  # Highlight cards
│   │   └── ChartsSection.tsx  # Recharts visualizations
│   ├── package.json           # Node.js dependencies
│   └── README.md             # Dashboard documentation
│
├── plots/                      # Generated visualization images
│   ├── cumulative_pnl.png     # Cumulative P&L chart
│   ├── wins_losses_pie.png    # Win/loss distribution
│   └── pnl_histogram.png      # P&L distribution histogram
│
├── read_pnl.py                # Simple P&L reader utility
├── report.md                  # Generated performance report
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+ (for trade analyzer)
- Node.js 18+ and npm (for dashboard)
- Zerodha F&O P&L Excel export file

### Installation

#### 1. Python Trade Analyzer

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r trade_analyzer/requirements.txt
```

#### 2. Next.js Dashboard

```bash
cd financial-dashboard
npm install
```

## 💻 Usage

### Command-Line Interface

Analyze a Zerodha P&L Excel file from the command line:

```bash
cd trade_analyzer
python trade_analyzer.py \
  --file /path/to/zerodha_pnl.xlsx \
  --capital 100000 \
  --risk_free_rate 0.03 \
  --output ../report.md
```

**Arguments:**
- `--file` / `-f`: Path to Zerodha P&L Excel file (required)
- `--capital` / `-c`: Initial capital amount (default: 100000)
- `--risk_free_rate` / `-r`: Annual risk-free rate as decimal (default: 0.03 = 3%)
- `--output` / `-o`: Output Markdown report path (default: report.md)

### Streamlit Web Interface

Run the interactive web app:

```bash
cd trade_analyzer
streamlit run frontend/app.py
```

Then open your browser to the URL shown (typically `http://localhost:8501`). You can:
- Upload a Zerodha F&O P&L Excel file
- Configure initial capital and risk-free rate
- View generated reports and visualizations inline

### Next.js Dashboard

View the React dashboard:

```bash
cd financial-dashboard
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard with:
- Key metric cards (Net P&L, Win Rate, Sharpe Ratio)
- Interactive charts (Win/Loss pie, Cumulative P&L)
- Detailed performance tables

## 📊 Features

### Performance Metrics Calculated

- **Basic Metrics:**
  - Total Realized/Unrealized P&L
  - Total Charges and Credits/Debits
  - Net P&L and Portfolio Value

- **Trading Statistics:**
  - Total Trades, Win Rate, Win/Loss Ratio
  - Average Win/Loss, Expectancy
  - Profit Factor

- **Risk-Adjusted Metrics:**
  - Sharpe Ratio (risk-adjusted return)
  - Sortino Ratio (downside risk-adjusted return)
  - Maximum Drawdown
  - CAGR (Compounded Annual Growth Rate)

### Visualizations Generated

1. **Cumulative P&L Chart** - Shows profit progression over time
2. **Win/Loss Pie Chart** - Distribution of winning vs losing trades
3. **P&L Histogram** - Distribution of individual trade P&L values

## 🔧 Technical Details

### Python Dependencies

- `pandas` - Data manipulation and Excel reading
- `numpy` - Numerical computations
- `matplotlib` - Plot generation
- `seaborn` - Statistical visualizations
- `openpyxl` - Excel file parsing
- `streamlit` - Web interface framework

### JavaScript Dependencies

- `next` - React framework
- `react` / `react-dom` - UI library
- `recharts` - Charting library
- `tailwindcss` - CSS framework
- `typescript` - Type safety

### Data Processing

The analyzer:
1. Detects header rows in Zerodha Excel exports
2. Extracts period dates from file headers
3. Parses trade data (Symbol, Quantity, Buy/Sell Values, P&L)
4. Calculates comprehensive performance metrics
5. Generates visualizations and Markdown reports

## 📝 Output Files

- `report.md` - Comprehensive Markdown report with all metrics
- `plots/cumulative_pnl.png` - Cumulative P&L visualization
- `plots/wins_losses_pie.png` - Win/loss distribution chart
- `plots/pnl_histogram.png` - P&L distribution histogram

## 🛠️ Development

### Project Components

1. **Core Analyzer** (`trade_analyzer/trade_analyzer.py`)
   - Data loading and cleaning
   - Metric computation
   - Report generation
   - Plot creation

2. **Streamlit Frontend** (`trade_analyzer/frontend/app.py`)
   - File upload interface
   - Interactive parameter configuration
   - Inline report and plot display

3. **Next.js Dashboard** (`financial-dashboard/`)
   - Modern React UI
   - Responsive design
   - Interactive charts
   - Dark theme by default

## 📄 License

This project is provided as-is for personal use.

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows existing style conventions
- Tests are added for new features
- Documentation is updated accordingly

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Note:** This tool is designed specifically for Zerodha F&O P&L Excel exports. The file format may vary, and the parser includes heuristics to handle common variations.
