import pandas as pd


def main():
    file_path = "/Users/charandeepkapoor/Downloads/pnl-PQ4709 (4).xlsx"

    # Read the Excel file into a DataFrame (first sheet by default)
    df = pd.read_excel(file_path)

    # Display the first few rows
    print(df.head())


if __name__ == "__main__":
    main()

