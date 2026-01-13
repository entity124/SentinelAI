"use client";

import { useState } from "react";
import Link from "next/link";

// Transaction data type
interface Transaction {
    id: number;
    date: string;
    merchant: string;
    amount: number;
    category: string;
    isPredatory: boolean;
    predatoryReason?: string;
}

// Hardcoded transaction data
const transactions: Transaction[] = [
    { id: 1, date: "2025-01-09", merchant: "Netflix Premium", amount: 22.99, category: "Entertainment", isPredatory: false },
    { id: 2, date: "2025-01-08", merchant: "Adobe Creative Cloud", amount: 79.99, category: "Software", isPredatory: true, predatoryReason: "Price increased 40% without notice. Auto-renewed after free trial ended." },
    { id: 3, date: "2025-01-07", merchant: "Spotify Family", amount: 16.99, category: "Entertainment", isPredatory: false },
    { id: 4, date: "2025-01-06", merchant: "Amazon Prime", amount: 14.99, category: "Shopping", isPredatory: false },
    { id: 5, date: "2025-01-05", merchant: "McAfee Total Protection", amount: 149.99, category: "Security", isPredatory: true, predatoryReason: "Dark pattern enrollment. Difficult cancellation process. 300% price jump after first year." },
    { id: 6, date: "2025-01-04", merchant: "Gym Membership Plus", amount: 89.99, category: "Health", isPredatory: false },
    { id: 7, date: "2025-01-03", merchant: "Cloud Storage Pro", amount: 9.99, category: "Software", isPredatory: false },
    { id: 8, date: "2025-01-02", merchant: "NewsMax Digital", amount: 4.99, category: "News", isPredatory: false },
    { id: 9, date: "2025-01-01", merchant: "Identity Guard Premium", amount: 29.99, category: "Security", isPredatory: true, predatoryReason: "Charges continued 6 months after cancellation request. Hidden annual commitment." },
    { id: 10, date: "2024-12-30", merchant: "Hulu + Live TV", amount: 82.99, category: "Entertainment", isPredatory: false },
    { id: 11, date: "2024-12-28", merchant: "Microsoft 365", amount: 12.99, category: "Software", isPredatory: false },
    { id: 12, date: "2024-12-26", merchant: "Audible Premium", amount: 14.95, category: "Entertainment", isPredatory: false },
    { id: 13, date: "2024-12-24", merchant: "TechSupport Helpline", amount: 39.99, category: "Services", isPredatory: true, predatoryReason: "Scam subscription targeting elderly. No service provided. Exploitative enrollment." },
    { id: 14, date: "2024-12-22", merchant: "Disney+ Bundle", amount: 19.99, category: "Entertainment", isPredatory: false },
    { id: 15, date: "2024-12-20", merchant: "NYT Digital", amount: 17.00, category: "News", isPredatory: false },
    { id: 16, date: "2024-12-18", merchant: "Dropbox Plus", amount: 11.99, category: "Software", isPredatory: false },
    { id: 17, date: "2024-12-15", merchant: "Planet Fitness", amount: 24.99, category: "Health", isPredatory: false },
    { id: 18, date: "2024-12-12", merchant: "LinkedIn Premium", amount: 59.99, category: "Career", isPredatory: false },
];

export default function Dashboard() {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [activeNav, setActiveNav] = useState("transactions");

    const flaggedCount = transactions.filter((t) => t.isPredatory).length;
    const potentialSavings = transactions
        .filter((t) => t.isPredatory)
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="flex min-h-[calc(100vh-120px)]">
            {/* Left Sidebar */}
            <aside className="w-64 border-r border-[#1a1a1a] p-6 flex flex-col">
                {/* User Profile */}
                <div className="mb-8">
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center text-2xl mb-3">
                        👵
                    </div>
                    <h3 className="font-semibold text-lg">Margaret Wilson</h3>
                    <p className="text-sm text-[#888]">Vulnerable Customer Profile</p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-[#1a1a1a] rounded text-[#00ff88]">
                        Elderly • Protected
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveNav("transactions")}
                        className={`text-left px-4 py-3 rounded-lg transition-colors ${activeNav === "transactions"
                            ? "bg-[#00ff88] text-black font-semibold"
                            : "hover:bg-[#1a1a1a]"
                            }`}
                    >
                        Transactions
                    </button>
                    <button
                        onClick={() => setActiveNav("alerts")}
                        className={`text-left px-4 py-3 rounded-lg transition-colors ${activeNav === "alerts"
                            ? "bg-[#00ff88] text-black font-semibold"
                            : "hover:bg-[#1a1a1a]"
                            }`}
                    >
                        Alerts
                    </button>
                    <Link
                        href="/governance"
                        className="text-left px-4 py-3 rounded-lg transition-colors hover:bg-[#1a1a1a]"
                    >
                        Governance
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    {/* Flags Detected */}
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
                        <p className="text-sm text-[#888] mb-1">Flags Detected</p>
                        <p className="text-4xl font-bold text-[#ff4444]">{flaggedCount}</p>
                    </div>

                    {/* Potential Savings */}
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
                        <p className="text-sm text-[#888] mb-1">Potential Savings</p>
                        <p className="text-4xl font-bold text-[#00ff88]">
                            ${potentialSavings.toFixed(0)}<span className="text-lg">/mo</span>
                        </p>
                    </div>

                    {/* AI Status */}
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
                        <p className="text-sm text-[#888] mb-1">AI Status</p>
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00ff88]"></span>
                            </span>
                            <span className="text-2xl font-bold text-[#00ff88]">Active</span>
                        </div>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-[#1a1a1a]">
                        <h2 className="text-lg font-semibold">Recent Transactions</h2>
                    </div>
                    <table className="w-full">
                        <thead className="bg-[#0d0d0d]">
                            <tr className="text-left text-sm text-[#888]">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Merchant</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr
                                    key={tx.id}
                                    onClick={() => setSelectedTransaction(tx)}
                                    className={`border-b border-[#1a1a1a] cursor-pointer transition-colors ${tx.isPredatory
                                        ? "bg-[#ff444410] hover:bg-[#ff444420]"
                                        : "hover:bg-[#1a1a1a]"
                                        }`}
                                >
                                    <td className="px-6 py-4 text-sm">{tx.date}</td>
                                    <td className="px-6 py-4 font-medium">{tx.merchant}</td>
                                    <td className="px-6 py-4 text-sm text-[#888]">{tx.category}</td>
                                    <td className="px-6 py-4 text-right font-mono">
                                        ${tx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {tx.isPredatory ? (
                                            <span className="px-3 py-1 text-xs font-semibold bg-[#ff4444] text-white rounded-full">
                                                Flagged
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs text-[#888] bg-[#1a1a1a] rounded-full">
                                                Normal
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Alert Modal */}
            {selectedTransaction && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedTransaction(null)}
                >
                    <div
                        className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl max-w-lg w-full p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-1">
                                    {selectedTransaction.merchant}
                                </h3>
                                <p className="text-[#888]">{selectedTransaction.date}</p>
                            </div>
                            {selectedTransaction.isPredatory && (
                                <span className="px-3 py-1 text-sm font-semibold bg-[#ff4444] text-white rounded-full">
                                    ⚠️ Predatory
                                </span>
                            )}
                        </div>

                        {/* Amount */}
                        <div className="mb-6">
                            <p className="text-sm text-[#888] mb-1">Charge Amount</p>
                            <p className="text-4xl font-bold">
                                ${selectedTransaction.amount.toFixed(2)}
                                <span className="text-lg text-[#888]">/month</span>
                            </p>
                        </div>

                        {/* Flagged Explanation */}
                        {selectedTransaction.isPredatory && (
                            <div className="mb-4 p-4 bg-[#ff444410] border border-[#ff4444] rounded-xl">
                                <p className="font-semibold text-[#ff4444] mb-2">🚨 Flagged</p>
                                <p className="text-sm leading-relaxed">
                                    Price jumped 200% after trial + no user activity 6 months.
                                </p>
                            </div>
                        )}

                        {/* watsonx.ai Reason */}
                        {selectedTransaction.isPredatory && (
                            <div className="mb-6 p-4 bg-[#00ff8810] border border-[#00ff88] rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[#00ff88]">🤖</span>
                                    <p className="font-semibold text-[#00ff88]">watsonx.ai Reason</p>
                                </div>
                                <p className="text-sm leading-relaxed font-mono text-[#aaa]">
                                    &quot;Based on transaction pattern analysis, this subscription exhibits 3 predatory indicators:
                                    (1) aggressive price escalation post-trial, (2) dormant account exploitation,
                                    (3) dark pattern cancellation flow. Confidence: 94.7%. Recommend immediate review.&quot;
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 mb-4">
                            {selectedTransaction.isPredatory && (
                                <button
                                    onClick={() => {
                                        alert("Dispute submitted! Your bank will review this transaction within 48 hours.");
                                        setSelectedTransaction(null);
                                    }}
                                    className="flex-1 bg-[#ff4444] hover:bg-[#cc3333] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                                >
                                    Dispute
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                            >
                                Ignore
                            </button>
                        </div>

                        {/* Governance Link */}
                        {selectedTransaction.isPredatory && (
                            <div className="text-center">
                                <Link
                                    href="/governance"
                                    className="text-sm text-[#00ff88] hover:underline"
                                    onClick={() => setSelectedTransaction(null)}
                                >
                                    View Responsible AI Proof →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
