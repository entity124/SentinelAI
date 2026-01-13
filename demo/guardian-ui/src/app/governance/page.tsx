"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "fairness" | "transparency" | "privacy";

// SVG Icon Components
const ScaleIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

const SearchIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const LockIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const ShieldIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const KeyIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
);

const UserIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ClipboardIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const ServerIcon = () => (
    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
);

const CpuIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
);

const DeviceIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const BankIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

export default function Governance() {
    const [activeTab, setActiveTab] = useState<TabType>("fairness");
    const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);

    const tabs = [
        { id: "fairness" as TabType, label: "Fairness", icon: <ScaleIcon /> },
        { id: "transparency" as TabType, label: "Transparency", icon: <SearchIcon /> },
        { id: "privacy" as TabType, label: "Privacy", icon: <LockIcon /> },
    ];

    return (
        <div style={{
            minHeight: "calc(100vh - 120px)",
            padding: "2rem",
            maxWidth: "1152px",
            margin: "0 auto",
            color: "#fff",
            fontFamily: "var(--font-geist-sans), sans-serif"
        }}>
            {/* Header */}
            <div style={{ marginBottom: "2.5rem" }}>
                <Link
                    href="/dashboard"
                    style={{
                        color: "#00ff88",
                        fontSize: "0.875rem",
                        marginBottom: "1.5rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        textDecoration: "none",
                        transition: "transform 0.2s"
                    }}
                    className="group"
                >
                    <span style={{ transition: "transform 0.2s" }} className="group-hover:-translate-x-1">←</span>
                    Back to Dashboard
                </Link>
                <h1 style={{
                    fontSize: "2.25rem",
                    fontWeight: "700",
                    marginBottom: "0.75rem",
                    color: "#fff",
                    lineHeight: "1.1"
                }}>
                    Responsible AI Governance
                </h1>
                <p style={{
                    color: "#888",
                    fontSize: "1.125rem",
                    maxWidth: "42rem",
                    lineHeight: "1.6"
                }}>
                    Built with IBM&apos;s AI Ethics principles. GuardianAI ensures every decision is explainable, fair, and fully secure.
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: "inline-flex",
                gap: "0.5rem",
                marginBottom: "2rem",
                backgroundColor: "#0a0a0a",
                padding: "0.25rem",
                borderRadius: "1rem",
                border: "1px solid #1a1a1a"
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        onMouseEnter={() => setHoveredTab(tab.id)}
                        onMouseLeave={() => setHoveredTab(null)}
                        style={{
                            padding: "0.625rem 1.5rem",
                            borderRadius: "0.75rem",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.625rem",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s",
                            backgroundColor: activeTab === tab.id ? "#1a1a1a" : (hoveredTab === tab.id ? "#111" : "transparent"),
                            color: activeTab === tab.id ? "#00ff88" : (hoveredTab === tab.id ? "#bbb" : "#666"),
                            boxShadow: activeTab === tab.id ? "0 0 0 1px rgba(0,255,136,0.2)" : "none",
                            outline: "none"
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: "500px" }}>
                <AnimatePresence mode="wait">
                    {/* Fairness Tab */}
                    {activeTab === "fairness" && (
                        <motion.div
                            key="fairness"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
                        >
                            <div style={{
                                backgroundColor: "#0a0a0a",
                                border: "1px solid #1a1a1a",
                                borderRadius: "1.5rem",
                                padding: "2.5rem",
                                position: "relative",
                                overflow: "hidden",
                                transition: "border-color 0.5s"
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)"}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}
                            >
                                {/* Glow Effect */}
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "24rem",
                                    height: "24rem",
                                    backgroundColor: "#00ff88",
                                    opacity: 0.03,
                                    filter: "blur(100px)",
                                    borderRadius: "9999px",
                                    pointerEvents: "none"
                                }} />

                                <div style={{
                                    position: "relative",
                                    zIndex: 10,
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: "4rem",
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                }}>
                                    {/* Left Column */}
                                    <div style={{ flex: 1, minWidth: "300px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2rem" }}>
                                            <div style={{
                                                width: "3.5rem",
                                                height: "3.5rem",
                                                borderRadius: "1rem",
                                                backgroundColor: "rgba(0,255,136,0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#00ff88"
                                            }}>
                                                <ScaleIcon />
                                            </div>
                                            <div>
                                                <h2 style={{ fontSize: "1.875rem", fontWeight: "700", color: "#fff", marginBottom: "0.25rem", lineHeight: "1.2" }}>
                                                    Bias Detection
                                                </h2>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "9999px", backgroundColor: "#00ff88" }} />
                                                    <p style={{ color: "#00ff88", fontWeight: "500", fontSize: "0.875rem", margin: 0 }}>
                                                        No bias detected across demographics
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <p style={{ color: "#888", lineHeight: "1.625", marginBottom: "2.5rem", fontSize: "1.125rem" }}>
                                            GuardianAI continuously monitors flagging patterns across income levels, age groups,
                                            and geographic regions. Statistical parity is maintained within strict tolerances.
                                        </p>

                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                            <div style={{
                                                backgroundColor: "#111",
                                                borderRadius: "1rem",
                                                padding: "1.25rem",
                                                border: "1px solid #1a1a1a"
                                            }}>
                                                <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "#fff", marginBottom: "0.25rem" }}>0.98</div>
                                                <div style={{ fontSize: "0.75rem", color: "#666", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Demographic Parity</div>
                                            </div>
                                            <div style={{
                                                backgroundColor: "#111",
                                                borderRadius: "1rem",
                                                padding: "1.25rem",
                                                border: "1px solid #1a1a1a"
                                            }}>
                                                <div style={{ fontSize: "1.875rem", fontWeight: "700", color: "#fff", marginBottom: "0.25rem" }}>99.2%</div>
                                                <div style={{ fontSize: "0.75rem", color: "#666", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Calibration Score</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Chart */}
                                    <div style={{
                                        flex: 1,
                                        minWidth: "300px",
                                        backgroundColor: "#0d0d0d",
                                        borderRadius: "1rem",
                                        padding: "2rem",
                                        border: "1px solid #1a1a1a",
                                        height: "100%",
                                        minHeight: "360px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center"
                                    }}>
                                        <h3 style={{ fontSize: "0.875rem", fontWeight: "600", color: "#888", marginBottom: "3rem", marginTop: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                            Flagging Rate by Income
                                        </h3>
                                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "12rem", gap: "2rem", padding: "0 1rem" }}>
                                            {[
                                                { label: "<$30k", height: 65, value: "64%" },
                                                { label: "$30-60k", height: 68, value: "67%" },
                                                { label: "$60-100k", height: 63, value: "62%" },
                                                { label: ">$100k", height: 66, value: "65%" },
                                            ].map((bar, i) => (
                                                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", flex: 1, cursor: "default", width: "100%", position: "relative" }}
                                                    onMouseEnter={(e) => {
                                                        const label = e.currentTarget.querySelector('.value-label') as HTMLElement;
                                                        if (label) label.style.opacity = '1';
                                                        const barEl = e.currentTarget.querySelector('.bar-visual') as HTMLElement;
                                                        if (barEl) {
                                                            barEl.style.filter = 'brightness(1.2)';
                                                            barEl.style.boxShadow = '0 0 20px rgba(0,255,136,0.3)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const label = e.currentTarget.querySelector('.value-label') as HTMLElement;
                                                        if (label) label.style.opacity = '0';
                                                        const barEl = e.currentTarget.querySelector('.bar-visual') as HTMLElement;
                                                        if (barEl) {
                                                            barEl.style.filter = 'none';
                                                            barEl.style.boxShadow = 'none';
                                                        }
                                                    }}
                                                >
                                                    <div className="value-label" style={{
                                                        opacity: 0,
                                                        transition: "opacity 0.2s",
                                                        fontSize: "0.875rem",
                                                        color: "#00ff88",
                                                        fontWeight: "700",
                                                        position: "absolute",
                                                        top: "-2rem",
                                                        backgroundColor: "rgba(0,255,136,0.1)",
                                                        padding: "0.25rem 0.5rem",
                                                        borderRadius: "0.25rem",
                                                        textAlign: "center"
                                                    }}>
                                                        {bar.value}
                                                    </div>
                                                    <div className="bar-visual" style={{
                                                        width: "100%",
                                                        height: `${bar.height}%`,
                                                        background: "linear-gradient(180deg, #00ff88 0%, #00cc6e 100%)",
                                                        borderRadius: "0.5rem 0.5rem 0 0",
                                                        position: "relative",
                                                        transition: "all 0.3s"
                                                    }}>
                                                    </div>
                                                    <span style={{ fontSize: "0.625rem", color: "#666", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                                                        {bar.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Transparency Tab */}
                    {activeTab === "transparency" && (
                        <motion.div
                            key="transparency"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                backgroundColor: "#0a0a0a",
                                border: "1px solid #1a1a1a",
                                borderRadius: "1rem",
                                padding: "2rem"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                                <div style={{
                                    width: "3rem",
                                    height: "3rem",
                                    borderRadius: "0.75rem",
                                    backgroundColor: "rgba(0,255,136,0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#00ff88"
                                }}>
                                    <SearchIcon />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff", margin: 0 }}>Decision Trace</h2>
                                    <p style={{ color: "#888", fontSize: "0.875rem", marginTop: "0.125rem", margin: 0 }}>End-to-end explainability for every AI decision</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                {[
                                    {
                                        step: 1,
                                        title: "Transaction Ingestion",
                                        desc: "Raw transaction data received from bank API. PII tokenized immediately.",
                                        meta: "Input: {merchant: \"MCAFEE*RENEWAL\", amount: 149.99}",
                                        active: true
                                    },
                                    {
                                        step: 2,
                                        title: "Pattern Analysis (watsonx.ai)",
                                        desc: "LLM analyzes historical patterns, merchant reputation, and user behavior.",
                                        meta: "Features: [price_delta: +200%, activity: dormant]",
                                        active: true
                                    },
                                    {
                                        step: 3,
                                        title: "Risk Scoring",
                                        desc: "Ensemble model calculates predatory probability score.",
                                        meta: "Score: 0.947 | Threshold: 0.75 | Verdict: FLAGGED",
                                        active: true
                                    },
                                    {
                                        step: 4,
                                        title: "Alert Generated",
                                        desc: "User notified via banking app. Dispute option enabled.",
                                        meta: "Action: ALERT_USER | Confidence: 94.7%",
                                        active: false,
                                        isAlert: true
                                    },
                                ].map((item, i, arr) => (
                                    <div key={item.step} style={{ display: "flex", gap: "1.5rem" }} className="group">
                                        {/* Time Column */}
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "40px" }}>
                                            <div style={{
                                                width: "2rem",
                                                height: "2rem",
                                                borderRadius: "9999px",
                                                border: item.isAlert ? "2px solid #ff4444" : "2px solid #00ff88",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "0.75rem",
                                                fontWeight: "700",
                                                position: "relative",
                                                zIndex: 10,
                                                backgroundColor: "#0a0a0a",
                                                color: item.isAlert ? "#ff4444" : "#00ff88",
                                                boxShadow: item.isAlert ? "0 0 15px rgba(255,68,68,0.2)" : "0 0 15px rgba(0,255,136,0.1)",
                                                transition: "color 0.3s"
                                            }}>
                                                {item.step}
                                            </div>
                                            {/* Line */}
                                            {i !== arr.length - 1 && (
                                                <div style={{
                                                    width: "2px",
                                                    height: "100%",
                                                    backgroundColor: "#1a1a1a",
                                                    margin: "0.5rem 0",
                                                    position: "relative",
                                                    transition: "background-color 0.3s"
                                                }} className="group-hover:bg-[#222]">
                                                    <div style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "50%",
                                                        background: "linear-gradient(to bottom, rgba(0,255,136,0.5), transparent)",
                                                        opacity: 0.5
                                                    }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Column */}
                                        <div style={{ paddingBottom: "2rem", paddingTop: "0.25rem", flex: 1 }}>
                                            <div style={{
                                                backgroundColor: "#111",
                                                border: "1px solid #1a1a1a",
                                                borderRadius: "0.75rem",
                                                padding: "1.25rem",
                                                transition: "all 0.3s",
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = "#333";
                                                    e.currentTarget.style.transform = "translateX(4px)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = "#1a1a1a";
                                                    e.currentTarget.style.transform = "translateX(0)";
                                                }}
                                            >
                                                <h4 style={{
                                                    fontSize: "1rem",
                                                    fontWeight: "700",
                                                    marginBottom: "0.25rem",
                                                    color: item.isAlert ? "#ff4444" : "#fff",
                                                    margin: "0 0 0.25rem 0"
                                                }}>
                                                    {item.title}
                                                </h4>
                                                <p style={{ fontSize: "0.875rem", color: "#888", marginBottom: "0.75rem", lineHeight: "1.6" }}>{item.desc}</p>
                                                <div style={{
                                                    fontSize: "0.75rem",
                                                    fontFamily: "monospace",
                                                    padding: "0.625rem",
                                                    borderRadius: "0.5rem",
                                                    border: "1px solid transparent",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    backgroundColor: item.isAlert ? "rgba(255,68,68,0.05)" : "rgba(0,255,136,0.05)",
                                                    borderColor: item.isAlert ? "rgba(255,68,68,0.2)" : "rgba(0,255,136,0.2)",
                                                    color: item.isAlert ? "#ff8888" : "#66dda6"
                                                }}>
                                                    <span style={{ opacity: 0.5 }}>&gt;</span>
                                                    {item.meta}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === "privacy" && (
                        <motion.div
                            key="privacy"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                        >
                            <div style={{
                                backgroundColor: "#0a0a0a",
                                border: "1px solid #1a1a1a",
                                borderRadius: "1rem",
                                padding: "2rem",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    width: "24rem",
                                    height: "24rem",
                                    backgroundColor: "#00ff88",
                                    opacity: 0.03,
                                    filter: "blur(100px)",
                                    borderRadius: "9999px",
                                    pointerEvents: "none"
                                }} />

                                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                                    <div style={{
                                        width: "3rem",
                                        height: "3rem",
                                        borderRadius: "0.75rem",
                                        backgroundColor: "rgba(0,255,136,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#00ff88"
                                    }}>
                                        <LockIcon />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#fff", margin: 0 }}>Data Privacy</h2>
                                        <p style={{ color: "#00ff88", fontWeight: "500", fontSize: "0.875rem", marginTop: "0.125rem", margin: 0 }}>Processed via IBM Hyper Protect</p>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                                    {[
                                        { icon: <ShieldIcon />, title: "End-to-End Encryption", desc: "AES-256 encryption in transit and at rest" },
                                        { icon: <KeyIcon />, title: "Confidential Computing", desc: "Secure enclaves via IBM Hyper Protect" },
                                        { icon: <UserIcon />, title: "PII Tokenization", desc: "Data replaced with secure tokens" },
                                        { icon: <ClipboardIcon />, title: "SOC 2 Type II", desc: "Independently audited compliance" },
                                    ].map((feature, i) => (
                                        <div key={i} style={{
                                            backgroundColor: "#111",
                                            border: "1px solid #1a1a1a",
                                            borderRadius: "0.75rem",
                                            padding: "1.25rem",
                                            display: "flex",
                                            gap: "1rem",
                                            transition: "border-color 0.3s"
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = "rgba(0,255,136,0.3)";
                                                // Note: We can't easily do child selections with inline styles for hover states without CSS-in-JS or state.
                                                // For a true "remove all tailwind" approach, complex hover interactions on children are tricky.
                                                // I'll keep it simple for now as per "style={{}}" request.
                                            }}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#1a1a1a"}
                                        >
                                            <div style={{
                                                width: "2.5rem",
                                                height: "2.5rem",
                                                borderRadius: "0.5rem",
                                                backgroundColor: "#0a0a0a",
                                                border: "1px solid #222",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#666",
                                                flexShrink: 0
                                            }}>
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: "600", color: "#fff", fontSize: "0.875rem", marginBottom: "0.25rem", margin: 0 }}>{feature.title}</p>
                                                <p style={{ fontSize: "0.75rem", color: "#666", margin: 0 }}>{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Secure Data Flow */}
                                <div style={{
                                    backgroundColor: "#111",
                                    borderRadius: "0.75rem",
                                    padding: "2rem",
                                    border: "1px solid #1a1a1a"
                                }}>
                                    <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#888", marginBottom: "2rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Secure Data Flow</h3>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "1.5rem",
                                        position: "relative",
                                        flexWrap: "wrap"
                                    }}>
                                        {/* Connecting Line (Desktop) - simplified as a border bottom on a container or absolute div */}
                                        <div style={{
                                            position: "absolute",
                                            top: "27px",
                                            left: 0,
                                            right: 0,
                                            height: "2px",
                                            backgroundColor: "#222",
                                            zIndex: 0,
                                            display: "none" // Hiding on mobile, showing via media query not possible with inline styles easily. I'll make it always visible but keep flex wrap behaviour in mind.
                                        }} className="desktop-line" />
                                        {/* Added class just for reference but style says display: none. 
                        Inline styles have limitations for media queries. 
                        I will assume desktop view mostly or rely on Flexbox wrapping.
                     */}

                                        {[
                                            { icon: <BankIcon />, label: "Bank API", sub: "Encrypted", active: false },
                                            { icon: <LockIcon />, label: "Hyper Protect", sub: "Secure Enclave", active: true },
                                            { icon: <CpuIcon />, label: "watsonx.ai", sub: "Tokenized", active: false },
                                            { icon: <DeviceIcon />, label: "User Alert", sub: "No PII Exposed", active: false },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", position: "relative", zIndex: 10, flex: 1, minWidth: "120px" }}>
                                                <div style={{
                                                    width: "3.5rem",
                                                    height: "3.5rem",
                                                    borderRadius: "1rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: item.active ? "2px solid #00ff88" : "2px solid #222",
                                                    boxShadow: item.active ? "0 0 15px rgba(0,255,136,0.2)" : "none",
                                                    backgroundColor: "#0a0a0a",
                                                    color: item.active ? "#00ff88" : "#666",
                                                    transform: item.active ? "scale(1.1)" : "scale(1)",
                                                    transition: "all 0.3s"
                                                }}>
                                                    {item.icon}
                                                </div>
                                                <div style={{ textAlign: "center" }}>
                                                    <p style={{ fontSize: "0.875rem", fontWeight: "700", color: item.active ? "#00ff88" : "#fff", margin: 0 }}>{item.label}</p>
                                                    <p style={{ fontSize: "0.625rem", color: "#555", fontWeight: "500", textTransform: "uppercase", marginTop: "0.125rem", margin: 0 }}>{item.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
