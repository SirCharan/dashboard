import argparse
import os
import re
from dataclasses import dataclass, asdict
from typing import Dict, Tuple, Optional

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")  # non-interactive backend for scripts/servers
import matplotlib.pyplot as plt
import seaborn as sns


NUMERIC_COLUMNS = [
    "Quantity",
    "Buy Value",
    "Sell Value",
    "Realized P&L",
    "Realized P&L Pct.",
    "Previous Closing Price",
    "Open Quantity",
    "Open Value",
    "Unrealized P&L",
    "Unrealized P&L Pct.",
]


@dataclass
class Metrics:
    total_realized_pnl: float
    total_unrealized_pnl: float
    total_charges: float
    other_credits_debits: float
    net_pnl: float
    portfolio_value: float

    total_trades: int
    winning_trades: int
    losing_trades: int
    breakeven_trades: int
    win_rate: float
    avg_win: float
    avg_loss: float
    win_loss_ratio: float
    expectancy: float
    profit_factor: float

    total_return_pct: float
    sharpe_ratio: Optional[float]
    sortino_ratio: Optional[float]
    max_drawdown_pct: Optional[float]
    cagr: Optional[float]
    avg_trade_duration_days: float


def detect_header_row(df_raw: pd.DataFrame) -> int:
    """
    Attempt to detect the row index where the trade table header starts.

    We look for a row that contains 'Symbol' and 'Quantity' in its values.
    Fallback: assume row 5 (skip 5 summary rows).
    """
    header_keywords = {"Symbol", "Quantity", "Buy Value", "Sell Value"}
    for idx in range(min(60, len(df_raw))):
        values = {str(v).strip() for v in df_raw.iloc[idx].tolist()}
        if header_keywords.issubset(values):
            return idx
    # Fallback: assume 5 lines of summary
    return 5


def load_data(file_path: str) -> Tuple[pd.DataFrame, float, float, Optional[pd.Timestamp], Optional[pd.Timestamp]]:
    """
    Read and clean the Zerodha P&L Excel file.

    Returns:
        df (pd.DataFrame): Cleaned trade table.
        total_charges (float)
        other_credits_debits (float)
        start_date (Optional[pd.Timestamp]): Period start date if found
        end_date (Optional[pd.Timestamp]): Period end date if found
    """
    # Read raw file with no header to detect structure
    df_raw = pd.read_excel(file_path, header=None, engine="openpyxl")
    
    # Try to extract period dates from the header (e.g., "P&L Statement for F&O from 2025-06-01 to 2026-02-05")
    start_date = None
    end_date = None
    for idx in range(min(15, len(df_raw))):
        row_text = " ".join(str(v) for v in df_raw.iloc[idx].tolist() if pd.notna(v))
        # Look for pattern: "from YYYY-MM-DD to YYYY-MM-DD"
        match = re.search(r"from\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})", row_text, re.IGNORECASE)
        if match:
            try:
                start_date = pd.Timestamp(match.group(1))
                end_date = pd.Timestamp(match.group(2))
                break
            except Exception:
                pass

    # Try to infer total charges and other credits/debits from the summary section
    total_charges = 0.0
    other_credits_debits = 0.0
    for idx in range(min(25, len(df_raw))):
        row = df_raw.iloc[idx]
        # Summary often has label in col 1 and value in col 2
        label = str(row.iloc[1]).strip() if len(row) > 1 else ""
        try:
            val = float(row.iloc[2]) if len(row) > 2 and pd.notna(row.iloc[2]) else None
        except (TypeError, ValueError):
            val = None
        if val is not None:
            if "Charges" in label and "Account" not in label and "Exchange" not in label and "Clearing" not in label and "GST" not in label and "Transaction" not in label and "Turnover" not in label and "Stamp" not in label and "IPFT" not in label:
                total_charges = val
            if "Other Credit" in label or "Other credit" in label or "Othercredits" in label.lower():
                other_credits_debits = val
    # Fallback: concat row text and parse
    if total_charges == 0.0 and other_credits_debits == 0.0:
        summary_section = df_raw.head(20).astype(str).agg(" ".join, axis=1).str.replace(r"\s+", "", regex=True)
        for line in summary_section:
            if "TotalCharges" in line:
                try:
                    num_str = "".join(ch if (ch.isdigit() or ch in ".-") else " " for ch in line.split("TotalCharges", 1)[1])
                    total_charges = float(num_str.split()[-1])
                except Exception:
                    pass
            if "Othercreditsanddebits" in line or "OtherCreditsDebits" in line:
                try:
                    num_str = "".join(ch if (ch.isdigit() or ch in ".-") else " " for ch in line.split("credits", 1)[-1])
                    other_credits_debits = float(num_str.split()[-1])
                except Exception:
                    pass

    header_row = detect_header_row(df_raw)
    df = pd.read_excel(
        file_path,
        header=header_row,
        engine="openpyxl",
    )

    # Drop completely empty columns
    df = df.dropna(axis=1, how="all")

    # Clean column names
    df.columns = [str(c).strip().replace("\n", " ") for c in df.columns]

    # Basic trimming of string columns
    if "Symbol" in df.columns:
        df["Symbol"] = df["Symbol"].astype(str).str.strip()

    # Ensure numeric columns are numeric; non-existing columns are ignored
    for col in NUMERIC_COLUMNS:
        if col in df.columns:
            df[col] = (
                df[col]
                .astype(str)
                .str.replace(",", "", regex=False)
                .str.replace(r"[^\d\.\-]", "", regex=True)
            )
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)

    # Filter out rows that don't have a symbol (likely extra summary/footer)
    if "Symbol" in df.columns:
        df = df[df["Symbol"].astype(str).str.strip() != ""]

    return df, float(total_charges), float(other_credits_debits), start_date, end_date


def infer_trade_date_from_symbol(symbol: str) -> Optional[pd.Timestamp]:
    """
    Try to infer an approximate date from an F&O symbol such as:
    ADANIENT25JUL2400PE

    Heuristic:
        - Look for patterns like 25JUL24 (day + month + 2-digit year)
        - Fallback: None
    """
    if not isinstance(symbol, str):
        return None

    # Very simple heuristic: search for THREE-letter month codes and surrounding digits
    months = {
        "JAN": 1,
        "FEB": 2,
        "MAR": 3,
        "APR": 4,
        "MAY": 5,
        "JUN": 6,
        "JUL": 7,
        "AUG": 8,
        "SEP": 9,
        "OCT": 10,
        "NOV": 11,
        "DEC": 12,
    }
    up = symbol.upper()
    for m_str, m_num in months.items():
        idx = up.find(m_str)
        if idx > 1 and idx + len(m_str) + 2 <= len(up):
            day_part = up[idx - 2 : idx]
            year_part = up[idx + len(m_str) : idx + len(m_str) + 2]
            if day_part.isdigit() and year_part.isdigit():
                day = int(day_part)
                year = 2000 + int(year_part)
                try:
                    return pd.Timestamp(year=year, month=m_num, day=day)
                except Exception:
                    continue
    return None


def compute_drawdown(cum_pnl: pd.Series, initial_capital: float = 0.0) -> Optional[float]:
    """
    Max drawdown as % of portfolio value (so result is between -100% and 0%).
    Portfolio value = initial_capital + cum_pnl; drawdown = (value - peak) / peak.
    """
    if cum_pnl.empty:
        return None
    if initial_capital <= 0:
        initial_capital = 1.0  # avoid div by zero; drawdown will be relative to P&L scale
    portfolio_value = initial_capital + cum_pnl
    running_max = portfolio_value.cummax()
    # Drawdown as decimal: (current - peak) / peak. Replace 0 peak to avoid div by zero.
    drawdown = (portfolio_value - running_max) / running_max.replace(0, np.nan)
    if drawdown.isna().all():
        return None
    return float(drawdown.min() * 100.0)


def compute_metrics(
    df: pd.DataFrame,
    initial_capital: float,
    risk_free_rate: float,
    start_date: Optional[pd.Timestamp] = None,
    end_date: Optional[pd.Timestamp] = None,
) -> Metrics:
    # Realized and unrealized subsets
    realized_mask = df.get("Realized P&L", pd.Series([0.0] * len(df))) != 0
    unrealized_mask = df.get("Open Quantity", pd.Series([0.0] * len(df))) != 0

    df_realized = df[realized_mask].copy()
    df_unrealized = df[unrealized_mask].copy()

    total_realized_pnl = float(df_realized.get("Realized P&L", pd.Series(dtype=float)).sum())
    total_unrealized_pnl = float(df_unrealized.get("Unrealized P&L", pd.Series(dtype=float)).sum())

    # Charges and other credits are not in df; they are computed at load time and passed via df attrs.
    total_charges = float(getattr(df, "_total_charges", 0.0))
    other_credits_debits = float(getattr(df, "_other_credits_debits", 0.0))

    net_pnl = total_realized_pnl + total_unrealized_pnl - total_charges + other_credits_debits
    portfolio_value = initial_capital + net_pnl

    total_trades = len(df_realized)
    winning_trades = int((df_realized["Realized P&L"] > 0).sum()) if total_trades else 0
    losing_trades = int((df_realized["Realized P&L"] < 0).sum()) if total_trades else 0
    breakeven_trades = int((df_realized["Realized P&L"] == 0).sum()) if total_trades else 0

    if total_trades > 0:
        win_rate = winning_trades / total_trades * 100.0
    else:
        win_rate = 0.0

    wins = df_realized[df_realized["Realized P&L"] > 0]["Realized P&L"]
    losses = df_realized[df_realized["Realized P&L"] < 0]["Realized P&L"]

    avg_win = float(wins.mean()) if not wins.empty else 0.0
    avg_loss = float(losses.mean()) if not losses.empty else 0.0  # negative
    avg_loss_abs = abs(avg_loss) if avg_loss != 0 else 0.0
    win_loss_ratio = avg_win / avg_loss_abs if avg_loss_abs > 0 else 0.0

    win_prob = winning_trades / total_trades if total_trades > 0 else 0.0
    loss_prob = losing_trades / total_trades if total_trades > 0 else 0.0
    expectancy = avg_win * win_prob + avg_loss * loss_prob

    total_profit = float(wins.sum()) if not wins.empty else 0.0
    total_loss_abs = float(-losses.sum()) if not losses.empty else 0.0
    profit_factor = total_profit / total_loss_abs if total_loss_abs > 0 else np.nan

    # Approximate period
    if start_date is None:
        # Try infer from symbols
        inferred_dates = df_realized["Symbol"].apply(infer_trade_date_from_symbol) if "Symbol" in df_realized.columns else pd.Series([], dtype="datetime64[ns]")
        if not inferred_dates.dropna().empty:
            start_date = inferred_dates.min()
            end_date = inferred_dates.max()
        else:
            # Fallback: assume 1 year period
            start_date = pd.Timestamp.today() - pd.Timedelta(days=365)
            end_date = pd.Timestamp.today()
    if end_date is None:
        end_date = pd.Timestamp.today()

    days = max((end_date - start_date).days, 1)
    years = days / 365.0

    total_return_pct = (net_pnl / initial_capital) * 100.0 if initial_capital > 0 else 0.0

    # Calculate Sharpe and Sortino ratios using trade-level returns
    # This gives a more accurate measure than evenly distributed daily returns
    if years > 0 and initial_capital > 0 and total_trades > 1:  # Need at least 2 trades for std dev
        # Calculate returns per trade: P&L / initial capital
        # This approximates return per trade assuming constant capital base
        trade_returns = df_realized["Realized P&L"].values / initial_capital
        
        # Annualized return: total return / years
        annualized_return = (total_realized_pnl / initial_capital) / years if years > 0 else 0.0
        excess_annualized_return = annualized_return - risk_free_rate
        
        # Calculate volatility: std dev of trade returns
        # To annualize, we need to scale by sqrt(trades per year)
        # This accounts for the fact that more frequent trading increases volatility
        trade_returns_std = trade_returns.std(ddof=1)  # Sample std dev
        trades_per_year = total_trades / years if years > 0 else total_trades
        
        # Annualize volatility: std_dev * sqrt(trades_per_year)
        # This assumes returns are independent and identically distributed
        annualized_volatility = trade_returns_std * np.sqrt(trades_per_year) if trades_per_year > 0 else 0.0
        
        # Calculate downside deviation for Sortino (only negative returns)
        negative_returns = trade_returns[trade_returns < 0]
        if len(negative_returns) > 1:
            downside_std = negative_returns.std(ddof=1)
            # Annualize downside volatility
            # Scale by sqrt of proportion of negative trades * trades per year
            neg_trade_proportion = len(negative_returns) / total_trades
            annualized_downside_volatility = downside_std * np.sqrt(trades_per_year * neg_trade_proportion) if trades_per_year > 0 else 0.0
        else:
            annualized_downside_volatility = 0.0
        
        # Sharpe Ratio = (Annualized Return - Risk-Free Rate) / Annualized Volatility
        sharpe_ratio = float(excess_annualized_return / annualized_volatility) if annualized_volatility > 0 else np.nan
        
        # Sortino Ratio = (Annualized Return - Risk-Free Rate) / Annualized Downside Volatility
        sortino_ratio = (
            float(excess_annualized_return / annualized_downside_volatility)
            if annualized_downside_volatility > 0
            else np.nan
        )
    else:
        sharpe_ratio = np.nan
        sortino_ratio = np.nan

    # Max drawdown based on cumulative realized P&L (as % of portfolio value)
    if "Symbol" in df_realized.columns and not df_realized.empty:
        df_realized = df_realized.copy()
        df_realized["__date__"] = df_realized["Symbol"].apply(infer_trade_date_from_symbol)
        if df_realized["__date__"].notna().any():
            df_realized = df_realized.sort_values("__date__")
        else:
            df_realized = df_realized.reset_index(drop=True)
        cum_pnl = df_realized["Realized P&L"].cumsum()
        max_drawdown_pct = compute_drawdown(cum_pnl, initial_capital)
    else:
        max_drawdown_pct = None

    # CAGR
    if years > 0 and initial_capital > 0:
        ending_value = initial_capital + total_realized_pnl
        try:
            cagr = (ending_value / initial_capital) ** (1 / years) - 1
        except Exception:
            cagr = np.nan
    else:
        cagr = np.nan

    # Approximate average trade duration (all trades spread over the full period)
    avg_trade_duration_days = days / max(total_trades, 1)

    return Metrics(
        total_realized_pnl=total_realized_pnl,
        total_unrealized_pnl=total_unrealized_pnl,
        total_charges=total_charges,
        other_credits_debits=other_credits_debits,
        net_pnl=net_pnl,
        portfolio_value=portfolio_value,
        total_trades=total_trades,
        winning_trades=winning_trades,
        losing_trades=losing_trades,
        breakeven_trades=breakeven_trades,
        win_rate=win_rate,
        avg_win=avg_win,
        avg_loss=avg_loss,
        win_loss_ratio=win_loss_ratio,
        expectancy=expectancy,
        profit_factor=profit_factor,
        total_return_pct=total_return_pct,
        sharpe_ratio=None if np.isnan(sharpe_ratio) else float(sharpe_ratio),
        sortino_ratio=None if np.isnan(sortino_ratio) else float(sortino_ratio),
        max_drawdown_pct=max_drawdown_pct,
        cagr=None if np.isnan(cagr) else float(cagr),
        avg_trade_duration_days=float(avg_trade_duration_days),
    )


def _ensure_plots_dir(base_dir: str) -> str:
    plots_dir = os.path.join(base_dir, "plots")
    os.makedirs(plots_dir, exist_ok=True)
    return plots_dir


def _extract_option_type(symbol: str) -> str:
    s = str(symbol).upper()
    if s.endswith("CE"):
        return "CE"
    if s.endswith("PE"):
        return "PE"
    if "FUT" in s:
        return "FUT"
    return "OTHER"


def generate_plots(df: pd.DataFrame, metrics: Metrics, output_dir: str) -> Dict[str, str]:
    """
    Generate plots and save them to output_dir.

    Returns a dict mapping plot name -> relative path.
    """
    sns.set(style="whitegrid")
    paths: Dict[str, str] = {}

    if df.empty:
        return paths

    # Cumulative P&L curve (realized)
    realized_mask = df.get("Realized P&L", pd.Series([0.0] * len(df))) != 0
    df_realized = df[realized_mask].copy()
    if not df_realized.empty:
        df_realized["__date__"] = df_realized["Symbol"].apply(infer_trade_date_from_symbol)
        if df_realized["__date__"].notna().any():
            df_realized = df_realized.sort_values("__date__")
        else:
            df_realized = df_realized.reset_index(drop=True)

        df_realized["cum_pnl"] = df_realized["Realized P&L"].cumsum()
        plt.figure(figsize=(10, 5))
        plt.plot(df_realized["cum_pnl"], marker="o")
        plt.title("Cumulative Realized P&L")
        plt.xlabel("Trade Index")
        plt.ylabel("Cumulative P&L")
        cum_path = os.path.join(output_dir, "cumulative_pnl.png")
        plt.tight_layout()
        plt.savefig(cum_path)
        plt.close()
        paths["cumulative_pnl"] = cum_path

    # Pie chart of wins vs losses
    if metrics.total_trades > 0:
        labels = ["Winning", "Losing", "Breakeven"]
        sizes = [metrics.winning_trades, metrics.losing_trades, metrics.breakeven_trades]
        plt.figure(figsize=(6, 6))
        plt.pie(
            sizes,
            labels=labels,
            autopct="%1.1f%%",
            startangle=90,
        )
        plt.title("Win / Loss / Breakeven Distribution")
        pie_path = os.path.join(output_dir, "wins_losses_pie.png")
        plt.tight_layout()
        plt.savefig(pie_path)
        plt.close()
        paths["wins_losses_pie"] = pie_path

    # Histogram of trade P&L
    if "Realized P&L" in df.columns and not df_realized.empty:
        plt.figure(figsize=(10, 5))
        sns.histplot(df_realized["Realized P&L"], bins=30, kde=True)
        plt.title("Distribution of Realized Trade P&L")
        plt.xlabel("Realized P&L per Trade")
        plt.ylabel("Count")
        hist_path = os.path.join(output_dir, "pnl_histogram.png")
        plt.tight_layout()
        plt.savefig(hist_path)
        plt.close()
        paths["pnl_histogram"] = hist_path

    return paths


def generate_report(metrics: Metrics, df: pd.DataFrame, plots: Dict[str, str], output_path: str) -> None:
    """
    Generate a Markdown report summarizing performance and save it to output_path.
    """
    lines = []

    lines.append("## P&L Performance Summary")
    lines.append("")
    lines.append("| Metric | Value |")
    lines.append("| --- | --- |")
    lines.append(f"| Total Realized P&L | {metrics.total_realized_pnl:,.2f} |")
    lines.append(f"| Total Unrealized P&L | {metrics.total_unrealized_pnl:,.2f} |")
    lines.append(f"| Total Charges | {metrics.total_charges:,.2f} |")
    lines.append(f"| Other Credits/Debits | {metrics.other_credits_debits:,.2f} |")
    lines.append(f"| Net P&L (after charges) | {metrics.net_pnl:,.2f} |")
    lines.append(f"| Portfolio Value | {metrics.portfolio_value:,.2f} |")
    lines.append("")

    lines.append("## Performance Metrics")
    lines.append("")
    lines.append("| Metric | Value | Explanation |")
    lines.append("| --- | --- | --- |")
    lines.append(f"| Total Trades | {metrics.total_trades} | Number of trades with non-zero realized P&L |")
    lines.append(f"| Winning Trades | {metrics.winning_trades} | Trades with positive realized P&L |")
    lines.append(f"| Losing Trades | {metrics.losing_trades} | Trades with negative realized P&L |")
    lines.append(f"| Breakeven Trades | {metrics.breakeven_trades} | Trades with zero realized P&L |")
    lines.append(f"| Win Rate % | {metrics.win_rate:.2f}% | Winning trades / total trades |")
    lines.append(f"| Average Win | {metrics.avg_win:,.2f} | Mean P&L of winning trades |")
    lines.append(f"| Average Loss | {metrics.avg_loss:,.2f} | Mean P&L of losing trades (negative) |")
    lines.append(f"| Win/Loss Ratio | {metrics.win_loss_ratio:.2f} | Average win / average loss (abs) |")
    lines.append(f"| Expectancy | {metrics.expectancy:,.2f} | Expected P&L per trade |")
    lines.append(f"| Profit Factor | {metrics.profit_factor:.2f} | Total profits / total losses |")
    lines.append(f"| Total Return % | {metrics.total_return_pct:.2f}% | Net P&L / initial capital |")
    lines.append(f"| Sharpe Ratio | {metrics.sharpe_ratio if metrics.sharpe_ratio is not None else 'N/A'} | Risk-adjusted return (all volatility) |")
    lines.append(f"| Sortino Ratio | {metrics.sortino_ratio if metrics.sortino_ratio is not None else 'N/A'} | Risk-adjusted return (downside volatility only) |")
    lines.append(f"| Max Drawdown % | {metrics.max_drawdown_pct if metrics.max_drawdown_pct is not None else 'N/A'} | Max peak-to-trough decline on cumulative P&L |")
    lines.append(f"| CAGR | {metrics.cagr if metrics.cagr is not None else 'N/A'} | Compounded annual growth rate (approx) |")
    lines.append(f"| Avg Trade Duration (days) | {metrics.avg_trade_duration_days:.2f} | Approx. period / total trades |")
    lines.append("")

    # Visuals section
    lines.append("## Visuals")
    lines.append("")
    if plots:
        for name, path in plots.items():
            rel = os.path.relpath(path, os.path.dirname(output_path))
            lines.append(f"- **{name.replace('_', ' ').title()}**: `{rel}`")
    else:
        lines.append("- No plots generated (no sufficient data).")
    lines.append("")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Analyze Zerodha F&O P&L Excel file.")
    parser.add_argument("--file", "-f", required=True, help="Path to Zerodha P&L Excel file (e.g., zerodha_pnl.xlsx).")
    parser.add_argument(
        "--capital",
        "-c",
        type=float,
        default=100000.0,
        help="Initial capital (default: 100000).",
    )
    parser.add_argument(
        "--risk_free_rate",
        "-r",
        type=float,
        default=0.03,
        help="Annual risk-free rate as decimal (default: 0.03 = 3%%).",
    )
    parser.add_argument(
        "--output",
        "-o",
        default="report.md",
        help="Output Markdown report path (default: report.md).",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    file_path = args.file
    initial_capital = args.capital
    risk_free_rate = args.risk_free_rate
    output_path = args.output

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Input file not found: {file_path}")

    base_dir = os.path.dirname(os.path.abspath(output_path)) or os.getcwd()
    plots_dir = _ensure_plots_dir(base_dir)

    df, total_charges, other_credits_debits, start_date, end_date = load_data(file_path)

    # Attach charges info to df so compute_metrics can access it
    setattr(df, "_total_charges", total_charges)
    setattr(df, "_other_credits_debits", other_credits_debits)

    metrics = compute_metrics(df, initial_capital, risk_free_rate, start_date=start_date, end_date=end_date)
    plots = generate_plots(df, metrics, plots_dir)
    generate_report(metrics, df, plots, output_path)

    print(f"Report saved to {output_path}")
    if plots:
        print("Generated plots:")
        for name, path in plots.items():
            print(f"  - {name}: {path}")


if __name__ == "__main__":
    main()

