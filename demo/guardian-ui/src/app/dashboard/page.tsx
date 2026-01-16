"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { transactions as initialTransactions, Transaction } from "../data/transactions";
import { Trash2 } from "lucide-react";
import ChatAssistant from "../components/ChatAssistant";

export default function Dashboard() {
    const [txData, setTxData] = useState<Transaction[]>(initialTransactions);
    const [activeNav, setActiveNav] = useState("transactions");

    // Simulating "Auth" user
    const userProfile = {
        name: "Alex Johnson",
        email: "alex.j@example.com",
    };

    const flaggedCount = txData.filter((t) => t.isPredatory).length;
    const flaggedTransactions = txData.filter((t) => t.isPredatory);
    const potentialSavings = flaggedTransactions.reduce((sum, t) => sum + t.amount, 0);

    const handleUnsubscribe = (e: React.MouseEvent, merchantName: string) => {
        e.stopPropagation();
        // Unsubscribe ALL transactions with the same merchant name
        setTxData(prev => prev.map(tx =>
            tx.merchant === merchantName ? { ...tx, isPredatory: false, status: "Unsubscribed" } : tx
        ));
    };

    const [simIndex, setSimIndex] = useState(0);
    const currentDateRef = useRef(new Date('2026-01-01T00:00:00'));

    // --- AUTOMATIC SIMULATION SCENARIOS ---
    // FLAGGED FIRST for demo visibility, then safe ones
    const scenarios = [
        { name: "Adobe Creative Cloud", amount: 99.99, cat: "Software", vector: [99.99, 25.0, 25.0, 30, 0, 1, 2] }, // FLAGGED
        { name: "McAfee Total Protection", amount: 179.99, cat: "Security", vector: [179.99, 20.0, 20.0, 365, 0, 1, 2] }, // FLAGGED
        { name: "QuickLoan Express", amount: 349.99, cat: "Finance", vector: [349.99, 25.0, 25.0, 30, 0, 1, 1] }, // FLAGGED
        { name: "Netflix", amount: 22.99, cat: "Entertainment", vector: [22.99, 0.0, 0.0, 30, 0, 1, 3] }, // Safe
        { name: "Spotify Family", amount: 16.99, cat: "Entertainment", vector: [16.99, 0.0, 0.0, 30, 0, 1, 3] }, // Safe
    ];

    useEffect(() => {
        const interval = setInterval(async () => {
            // Increment date FIRST (by 15 days)
            currentDateRef.current.setDate(currentDateRef.current.getDate() + 15);

            // Stop simulation after June 2026
            if (currentDateRef.current.getFullYear() > 2026 ||
                (currentDateRef.current.getFullYear() === 2026 && currentDateRef.current.getMonth() > 5)) {
                return;
            }

            const currentIndex = simIndex % scenarios.length;
            const scenario = scenarios[currentIndex];

            // Check if this merchant has been unsubscribed - if so, skip it
            const isUnsubscribed = txData.some(t => t.merchant === scenario.name && t.status === "Unsubscribed");
            if (isUnsubscribed) {
                setSimIndex(prev => prev + 1);
                return; // Skip this merchant
            }

            try {
                const res = await fetch('http://127.0.0.1:5000/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ feature_vector: scenario.vector })
                });

                const aiResult = await res.json();

                const dateStr = currentDateRef.current.toISOString().split('T')[0];

                const newTx: Transaction = {
                    id: Date.now(),
                    date: dateStr,
                    merchant: scenario.name,
                    amount: scenario.amount,
                    category: scenario.cat,
                    isPredatory: aiResult.is_flagged,
                    predatoryReason: aiResult.explanation
                };

                setTxData(prev => {
                    if (prev.length > 0 && prev[0].merchant === newTx.merchant) {
                        return prev;
                    }
                    return [newTx, ...prev];
                });

                setSimIndex(prev => prev + 1);

            } catch (err) {
                console.error("Simulation error:", err);
            }

        }, 4000);

        return () => clearInterval(interval);
    }, [simIndex]);

    return (
        <>
            <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "hidden" }}>
                {/* Left Sidebar */}
                <aside style={{
                    width: "220px",
                    borderRight: "1px solid #1a1a1a",
                    padding: "24px 20px",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    overflowY: "auto"
                }}>
                    {/* User Profile */}
                    <div style={{ marginBottom: "32px" }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #0d3320 0%, #1a1a1a 100%)",
                            border: "1px solid #1e5c3a",
                            marginBottom: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <img
                                src="/sentinel-piggy-logo.png"
                                alt="Sentinel Logo"
                                style={{ width: "32px", height: "32px", objectFit: "contain", filter: "invert(1)" }}
                            />
                        </div>
                        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{userProfile.name}</h3>
                        <p style={{ fontSize: "12px", color: "#666" }}>Premium Account</p>
                        <span style={{
                            display: "inline-block",
                            marginTop: "6px",
                            padding: "4px 10px",
                            fontSize: "10px",
                            background: "rgba(62, 207, 142, 0.1)",
                            border: "1px solid #34D399",
                            borderRadius: "12px",
                            color: "#34D399"
                        }}>
                            Protected
                        </span>
                    </div>

                    {/* Nav */}
                    <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <button
                            onClick={() => setActiveNav("transactions")}
                            style={{
                                textAlign: "left",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: activeNav === "transactions" ? 600 : 400,
                                background: activeNav === "transactions" ? "#34D399" : "transparent",
                                color: activeNav === "transactions" ? "#000" : "#fff",
                                transition: "all 0.15s"
                            }}
                        >
                            Transactions
                        </button>
                        <button
                            onClick={() => setActiveNav("alerts")}
                            style={{
                                textAlign: "left",
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: activeNav === "alerts" ? 600 : 400,
                                background: activeNav === "alerts" ? "#ff4444" : "transparent",
                                color: activeNav === "alerts" ? "#fff" : "#fff",
                                transition: "all 0.15s"
                            }}
                        >
                            Alerts
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* Fixed Stats Section */}
                    <div style={{ padding: "24px 32px", borderBottom: "1px solid #1a1a1a", background: "#050505", zIndex: 10, flexShrink: 0 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                            <div style={{
                                background: "linear-gradient(145deg, #111 0%, #050505 100%)",
                                border: "1px solid #1a1a1a",
                                borderBottom: "2px solid #34D399",
                                borderRadius: "16px",
                                padding: "24px 28px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "100px",
                                    height: "100px",
                                    background: "radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%)",
                                    transform: "translate(30%, -30%)"
                                }} />
                                <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: 500 }}>Potential Savings</p>
                                <p style={{ fontSize: "36px", fontWeight: 700, color: "#fff" }}>
                                    ${potentialSavings.toFixed(2)}<span style={{ fontSize: "16px", fontWeight: 400, color: "#666", marginLeft: "4px" }}>/mo</span>
                                </p>
                            </div>

                            <div style={{
                                background: "linear-gradient(145deg, #111 0%, #050505 100%)",
                                border: "1px solid #1a1a1a",
                                borderBottom: "2px solid #ff4444",
                                borderRadius: "16px",
                                padding: "24px 28px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "100px",
                                    height: "100px",
                                    background: "radial-gradient(circle, rgba(255, 68, 68, 0.1) 0%, transparent 70%)",
                                    transform: "translate(30%, -30%)"
                                }} />
                                <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: 500 }}>Flags Detected</p>
                                <p style={{ fontSize: "36px", fontWeight: 700, color: "#fff" }}>{flaggedCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Transactions Content */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
                        {activeNav === "transactions" ? (
                            <div style={{
                                background: "#0a0a0a",
                                border: "1px solid #1a1a1a",
                                borderRadius: "12px",
                                overflow: "hidden"
                            }}>
                                <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a1a1a" }}>
                                    <h2 style={{ fontSize: "14px", fontWeight: 600 }}>All Transactions</h2>
                                </div>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#0d0d0d", textAlign: "left", fontSize: "11px", color: "#666" }}>
                                            <th style={{ padding: "12px 20px", fontWeight: 500 }}>Date</th>
                                            <th style={{ padding: "12px 20px", fontWeight: 500 }}>Merchant</th>
                                            <th style={{ padding: "12px 20px", fontWeight: 500 }}>Category</th>
                                            <th style={{ padding: "12px 20px", fontWeight: 500, textAlign: "right" }}>Amount</th>
                                            <th style={{ padding: "12px 20px", fontWeight: 500 }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {txData.map((tx) => (
                                            <tr
                                                key={tx.id}
                                                style={{
                                                    borderBottom: "1px solid #1a1a1a",
                                                    background: tx.isPredatory ? "rgba(255, 68, 68, 0.05)" : "transparent",
                                                    transition: "background 0.15s"
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = tx.isPredatory ? "rgba(255, 68, 68, 0.1)" : "#111"}
                                                onMouseOut={(e) => e.currentTarget.style.background = tx.isPredatory ? "rgba(255, 68, 68, 0.05)" : "transparent"}
                                            >
                                                <td style={{ padding: "12px 20px", fontSize: "12px", color: "#888" }}>{tx.date}</td>
                                                <td style={{ padding: "12px 20px", fontSize: "13px", fontWeight: 500 }}>{tx.merchant}</td>
                                                <td style={{ padding: "12px 20px", fontSize: "12px", color: "#666" }}>{tx.category}</td>
                                                <td style={{ padding: "12px 20px", fontSize: "13px", fontFamily: "monospace", textAlign: "right" }}>
                                                    ${tx.amount.toFixed(2)}
                                                </td>
                                                <td style={{ padding: "12px 20px" }}>
                                                    {tx.isPredatory ? (
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <span style={{
                                                                padding: "4px 10px",
                                                                fontSize: "10px",
                                                                fontWeight: 600,
                                                                background: "#ff4444",
                                                                color: "#fff",
                                                                borderRadius: "10px"
                                                            }}>
                                                                Flagged
                                                            </span>
                                                            <button
                                                                onClick={(e) => handleUnsubscribe(e, tx.merchant)}
                                                                style={{
                                                                    background: "rgba(255, 68, 68, 0.1)",
                                                                    border: "1px solid rgba(255, 68, 68, 0.2)",
                                                                    cursor: "pointer",
                                                                    padding: "4px 8px",
                                                                    borderRadius: "6px",
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "4px",
                                                                    fontSize: "10px",
                                                                    color: "#ff4444",
                                                                    transition: "all 0.2s ease"
                                                                }}
                                                                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.2)"}
                                                                onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)"}
                                                            >
                                                                <Trash2 size={10} />
                                                                Unsubscribe
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={{
                                                            padding: "4px 10px",
                                                            fontSize: "10px",
                                                            color: "#555",
                                                            background: "#1a1a1a",
                                                            borderRadius: "10px"
                                                        }}>
                                                            Normal
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{
                                background: "#0a0a0a",
                                border: "1px solid rgba(255, 68, 68, 0.3)",
                                borderRadius: "12px",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    padding: "14px 20px",
                                    borderBottom: "1px solid rgba(255, 68, 68, 0.2)",
                                    background: "rgba(255, 68, 68, 0.05)"
                                }}>
                                    <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#ff4444" }}>Flagged Transactions</h2>
                                    <p style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Predatory patterns detected by AI</p>
                                </div>
                                {flaggedTransactions.length === 0 ? (
                                    <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                                        <p>No flagged transactions</p>
                                    </div>
                                ) : (
                                    <div>
                                        {flaggedTransactions.map((tx) => (
                                            <div
                                                key={tx.id}
                                                style={{
                                                    padding: "16px 20px",
                                                    borderBottom: "1px solid #1a1a1a",
                                                    transition: "background 0.15s"
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.05)"}
                                                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                                    <div>
                                                        <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{tx.merchant}</h3>
                                                        <p style={{ fontSize: "11px", color: "#666" }}>{tx.date} • {tx.category}</p>
                                                    </div>
                                                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                                                        <p style={{ fontSize: "16px", fontWeight: 600, color: "#ff4444" }}>${tx.amount.toFixed(2)}</p>
                                                        <button
                                                            onClick={(e) => handleUnsubscribe(e, tx.merchant)}
                                                            style={{
                                                                background: "rgba(255, 68, 68, 0.1)",
                                                                border: "1px solid rgba(255, 68, 68, 0.2)",
                                                                cursor: "pointer",
                                                                padding: "6px 10px",
                                                                borderRadius: "8px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "6px",
                                                                fontSize: "10px",
                                                                color: "#ff4444",
                                                                fontWeight: 600
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.2)"}
                                                            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)"}
                                                        >
                                                            <Trash2 size={12} />
                                                            Unsubscribe
                                                        </button>
                                                    </div>
                                                </div>
                                                {tx.predatoryReason && (
                                                    <div style={{
                                                        background: "#111",
                                                        borderRadius: "6px",
                                                        padding: "10px 12px",
                                                        fontSize: "11px",
                                                        color: "#888",
                                                        lineHeight: 1.5
                                                    }}>
                                                        <span style={{ color: "#ff4444", fontWeight: 500 }}>Reason: </span>
                                                        {tx.predatoryReason}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Chat Assistant with live transaction data */}
            <ChatAssistant txData={txData} />
        </>
    );
}
