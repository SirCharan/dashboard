import os
from io import BytesIO

import streamlit as st
import pandas as pd

from trade_analyzer import load_data, compute_metrics, generate_plots, generate_report, _ensure_plots_dir


def main():
    st.title("Zerodha F&O P&L Analyzer")

    st.markdown(
        """
        Upload your Zerodha F&O P&L Excel file to generate a detailed performance report,
        including key trading statistics, trade breakdowns, and visualizations.
        """
    )

    uploaded_file = st.file_uploader("Upload Zerodha P&L Excel file", type=["xlsx", "xls"])

    col1, col2 = st.columns(2)
    with col1:
        initial_capital = st.number_input("Initial Capital", min_value=0.0, value=100000.0, step=10000.0)
    with col2:
        risk_free_rate = st.number_input("Risk-Free Rate (annual, %)", min_value=0.0, value=3.0, step=0.5) / 100.0

    if uploaded_file is not None:
        if st.button("Generate Report"):
            with st.spinner("Processing file and generating report..."):
                # Read uploaded file into a temp buffer for pandas
                data = uploaded_file.read()
                buffer = BytesIO(data)

                df, total_charges, other_credits_debits, start_date, end_date = load_data(buffer)
                setattr(df, "_total_charges", total_charges)
                setattr(df, "_other_credits_debits", other_credits_debits)

                metrics = compute_metrics(df, initial_capital, risk_free_rate, start_date=start_date, end_date=end_date)

                base_dir = os.getcwd()
                plots_dir = _ensure_plots_dir(base_dir)
                plots = generate_plots(df, metrics, plots_dir)

                report_path = os.path.join(base_dir, "report_streamlit.md")
                generate_report(metrics, df, plots, report_path)

                st.success("Report generated.")

                # Display report content inline
                with open(report_path, "r", encoding="utf-8") as f:
                    report_md = f.read()
                st.markdown(report_md)

                # Show plots inline if available
                if plots:
                    st.subheader("Plots")
                    for name, path in plots.items():
                        st.image(path, caption=name.replace("_", " ").title(), use_column_width=True)


if __name__ == "__main__":
    main()

