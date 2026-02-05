# Trade Analyzer

This project analyzes Zerodha F&O P&L Excel exports and produces a comprehensive performance report with key metrics, trade breakdowns, and visualizations. It also includes a basic Streamlit frontend for uploading files and viewing reports in the browser.

## Project Structure

- `trade_analyzer.py`: Core analyzer script (CLI).
- `requirements.txt`: Python dependencies.
- `README.md`: This documentation.
- `data/`: Place sample or input Excel files here (optional).
- `plots/`: Generated plot images.
- `frontend/app.py`: Streamlit app for web-based usage.

## Installation

Create and activate a virtual environment (recommended), then install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
pip install -r trade_analyzer/requirements.txt
```

## Command-Line Usage

From the project root:

```bash
cd trade_analyzer
python trade_analyzer.py --file zerodha_pnl.xlsx --capital 100000 --risk_free_rate 0.03 --output report.md
```

- `--file`: Path to the Zerodha P&L Excel file.
- `--capital`: Initial capital (default: 100000).
- `--risk_free_rate`: Annual risk-free rate as a decimal (default: 0.03 for 3%).
- `--output`: Output Markdown report path (default: `report.md`).

The script will:

- Read and clean the Excel data.
- Compute performance metrics (win rate, Sharpe/Sortino, max drawdown, profit factor, etc.).
- Generate plots (cumulative P&L, win/loss pie, P&L histogram) into `plots/`.
- Save a Markdown report to `report.md` (or your chosen path).

## Streamlit Frontend

To run the Streamlit app:

```bash
cd trade_analyzer
streamlit run frontend/app.py
```

The app allows you to:

- Upload a Zerodha F&O P&L Excel file.
- Specify initial capital and risk-free rate.
- View the generated Markdown report and plots directly in the browser.

