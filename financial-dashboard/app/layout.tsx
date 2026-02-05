import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trading Performance Dashboard",
  description: "P&L and performance metrics dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
            <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
              <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                Trading Performance Dashboard
              </h1>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>

          {/* Optional footer */}
          <footer className="border-t border-slate-700 py-3 text-center text-xs text-slate-500">
            Data is hardcoded from report. Extend with file upload or API later.
          </footer>
        </div>
      </body>
    </html>
  );
}
