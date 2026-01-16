import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import ChatAssistant from "./components/ChatAssistant";
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
  title: "Sentinel - Financial Firewall",
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
          <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] fixed top-0 w-full bg-[#0a0a0a] z-50 h-[80px]">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-[#34D399]">Sentinel</span>
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/dashboard" className="hover:text-[#34D399] transition-colors">
                Dashboard
              </Link>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex-1" style={{ paddingTop: "80px" }}>
            {children}
          </main>

          {/* ChatAssistant moved to dashboard/page.tsx for access to live txData */}

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-[#2a2a2a] text-center text-sm text-[#888]">
            Built for IBM &middot; KingHacks 2025
          </footer>
        </div>
      </body>
    </html>
  );
}
