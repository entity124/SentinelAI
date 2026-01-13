import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GuardianAI - Financial Firewall",
  description: "Detects predatory subscriptions for banks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-[#00ff88]">Guardian</span>
              <span>AI</span>
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/dashboard" className="hover:text-[#00ff88] transition-colors">
                Dashboard
              </Link>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-[#2a2a2a] text-center text-sm text-[#888]">
            Built for IBM &middot; KingHacks 2025
          </footer>
        </div>
      </body>
    </html>
  );
}
