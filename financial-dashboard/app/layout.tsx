import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financial Dashboard",
  description: "P&L and performance metrics dashboard",
};

const navItems = [
  { href: "#overview", label: "overview" },
  { href: "#charts", label: "charts" },
  { href: "#summary", label: "summary" },
  { href: "#metrics", label: "metrics" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-foreground antialiased">
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[200px_1fr]">
          {/* Sidebar nav – reference: 200px, sticky, padding 3rem 2rem */}
          <nav
            className="flex flex-row items-center justify-between gap-6 overflow-x-auto border-b border-black/5 bg-cream px-6 py-6 md:h-screen md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:border-border-default md:px-8 md:py-12 md:gap-8 lg:sticky lg:top-0"
            aria-label="Main navigation"
          >
            <div className="brand shrink-0 text-[1.5rem] font-bold tracking-tight text-foreground md:mb-0">
              <Link href="/" className="no-underline text-foreground">
                Stocky AI
              </Link>
            </div>
            <ul className="flex shrink-0 flex-row gap-4 md:flex-col md:gap-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-item block text-sm lowercase text-foreground opacity-60 transition-opacity hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main + footer */}
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 px-4 py-8 md:pl-0 md:pr-12 md:pt-12 md:pb-12">
              {children}
            </main>
            <footer className="border-t border-border-default/10 px-4 py-6 md:px-12 md:py-8">
              <a
                href="https://t.me/ck_timekeeper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm lowercase text-foreground opacity-60 transition-opacity hover:opacity-100"
              >
                contact me
              </a>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
