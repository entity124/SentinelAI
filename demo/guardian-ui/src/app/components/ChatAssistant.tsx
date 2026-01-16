"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatTransactionsForAI, getFlaggedSummary, Transaction } from "../data/transactions";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatAssistantProps {
    txData?: Transaction[];
}

export default function ChatAssistant({ txData }: ChatAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "👋 Hello! I'm Sentinel, your financial guardian.\n\nI can explain any flagged transaction or help you understand charges on your account." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setIsLoading(true);

        try {
            // DYNAMIC DATA: Use live txData if provided, otherwise use static data
            const transactionContext = formatTransactionsForAI(txData);
            const flaggedAlerts = getFlaggedSummary(txData);

            const res = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    transactions: transactionContext,
                    model_result: flaggedAlerts
                })
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error. Please ensure the backend is running." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "16px",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
        }}>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        style={{
                            width: "400px",
                            height: "520px",
                            background: "linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)",
                            border: "1px solid #1f1f1f",
                            borderRadius: "20px",
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(52, 211, 153, 0.05)",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden"
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: "16px 20px",
                            background: "linear-gradient(90deg, rgba(52, 211, 153, 0.08) 0%, transparent 100%)",
                            borderBottom: "1px solid #1a1a1a",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "24px",
                                    boxShadow: "0 4px 12px rgba(52, 211, 153, 0.3)"
                                }}>
                                    <img
                                        src="/sentinel-logo.png"
                                        alt="Sentinel Logo"
                                        style={{ width: "32px", height: "32px", objectFit: "contain" }}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, color: "#fff", fontSize: "15px" }}>Sentinel AI</div>
                                    <div style={{ fontSize: "11px", color: "#34D399", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", animation: "pulse 2s infinite" }}></span>
                                        Powered by watsonx.ai
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#555",
                                    cursor: "pointer",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    transition: "all 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
                                onMouseOut={(e) => e.currentTarget.style.color = "#555"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        }}>
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: m.role === "user" ? "flex-end" : "flex-start"
                                    }}
                                >
                                    <div style={{
                                        maxWidth: "85%",
                                        padding: "12px 16px",
                                        borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                        fontSize: "14px",
                                        lineHeight: "1.5",
                                        background: m.role === "user"
                                            ? "linear-gradient(135deg, #1a1a1a 0%, #222 100%)"
                                            : "linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)",
                                        color: "#fff",
                                        border: m.role === "user" ? "1px solid #2a2a2a" : "1px solid rgba(52, 211, 153, 0.2)",
                                        boxShadow: m.role === "user" ? "none" : "0 4px 12px rgba(52, 211, 153, 0.1)"
                                    }}>
                                        {m.content.split('\n').map((line, j) => (
                                            <p key={j} style={{ margin: j === 0 ? 0 : "8px 0 0 0" }}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div style={{ display: "flex", justifyContent: "flex-start", opacity: 1 }}>
                                    <div style={{
                                        padding: "12px 16px",
                                        borderRadius: "16px 16px 16px 4px",
                                        background: "rgba(52, 211, 153, 0.05)",
                                        border: "1px solid rgba(52, 211, 153, 0.3)",
                                        boxShadow: "0 0 15px rgba(52, 211, 153, 0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px"
                                    }}>
                                        {/* Scanning Animation */}
                                        <div style={{
                                            width: "24px",
                                            height: "24px",
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <div style={{
                                                position: "absolute",
                                                inset: 0,
                                                border: "2px solid #34D399",
                                                borderRadius: "50%",
                                                opacity: 0.3
                                            }} />
                                            <div style={{
                                                width: "100%",
                                                height: "2px",
                                                background: "#34D399",
                                                boxShadow: "0 0 8px #34D399",
                                                animation: "scan 1.5s ease-in-out infinite"
                                            }} />
                                        </div>
                                        <span style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>
                                            Sentinel is thinking...
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: "16px 20px",
                            background: "#0d0d0d",
                            borderTop: "1px solid #1a1a1a"
                        }}>
                            <div style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "center"
                            }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask about a flagged charge..."
                                    style={{
                                        flex: 1,
                                        background: "#111",
                                        border: "1px solid #222",
                                        borderRadius: "12px",
                                        padding: "12px 16px",
                                        fontSize: "14px",
                                        color: "#fff",
                                        outline: "none",
                                        transition: "all 0.2s"
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = "#34D399"}
                                    onBlur={(e) => e.currentTarget.style.borderColor = "#222"}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "12px",
                                        border: "none",
                                        background: input.trim() ? "linear-gradient(135deg, #34D399 0%, #10B981 100%)" : "#1a1a1a",
                                        color: input.trim() ? "#000" : "#444",
                                        cursor: input.trim() ? "pointer" : "not-allowed",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.2s",
                                        boxShadow: input.trim() ? "0 4px 12px rgba(52, 211, 153, 0.3)" : "none"
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    border: "none",
                    background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
                    boxShadow: "0 8px 24px rgba(52, 211, 153, 0.4), 0 0 0 1px rgba(52, 211, 153, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#000"
                }}
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                )}
            </motion.button>

            {/* CSS Keyframes */}
            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                @keyframes scan {
                    0%, 100% { transform: translateY(-8px); opacity: 0.5; }
                    50% { transform: translateY(8px); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
