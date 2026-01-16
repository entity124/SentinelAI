// Shared transaction data - used by Dashboard and ChatAssistant
export interface Transaction {
    id: number;
    date: string;
    merchant: string;
    amount: number;
    category: string;
    isPredatory: boolean;
    predatoryReason?: string;
    status?: string;
}

export const transactions: Transaction[] = [
    // --- JANUARY 2025 (Flagged & Current) ---
    { id: 0, date: "2025-01-11", merchant: "PredatorySvc", amount: 49.99, category: "Software", isPredatory: true, predatoryReason: "Unannounced 40% price hike detected after a secret tier upgrade." },
    { id: 99, date: "2025-01-10", merchant: "QuickLoan Express", amount: 299.99, category: "Finance", isPredatory: true, predatoryReason: "20% interest rate adjustment hidden in monthly processing fee." },
    { id: 1, date: "2025-01-09", merchant: "Netflix", amount: 22.99, category: "Entertainment", isPredatory: false },
    { id: 2, date: "2025-01-08", merchant: "Adobe Creative Cloud", amount: 79.99, category: "Software", isPredatory: true, predatoryReason: "33% price increase detected compared to previous billing cycle." },
    { id: 3, date: "2025-01-07", merchant: "Spotify Family", amount: 16.99, category: "Entertainment", isPredatory: false },
    { id: 4, date: "2025-01-06", merchant: "Amazon Prime", amount: 14.99, category: "Shopping", isPredatory: false },
    { id: 5, date: "2025-01-05", merchant: "McAfee Total Protection", amount: 149.99, category: "Security", isPredatory: true, predatoryReason: "50% price jump detected. Auto-renewal price differs from last year's promo." },
    { id: 6, date: "2025-01-04", merchant: "Gym Membership Plus", amount: 89.99, category: "Health", isPredatory: false },
    { id: 7, date: "2025-01-03", merchant: "Cloud Storage Pro", amount: 9.99, category: "Software", isPredatory: false },
    { id: 8, date: "2025-01-02", merchant: "NewsMax Digital", amount: 4.99, category: "News", isPredatory: false },
    { id: 9, date: "2025-01-01", merchant: "Identity Guard Premium", amount: 29.99, category: "Security", isPredatory: true, predatoryReason: "Monthly fee increased by $10.00 since the baseline charge in December." },
    { id: 13, date: "2024-12-24", merchant: "TechSupport Helpline", amount: 39.99, category: "Services", isPredatory: true, predatoryReason: "Subscription cost increased significantly without prior user confirmation." },

    // --- DECEMBER 2024 (History Context) ---
    { id: 101, date: "2024-12-11", merchant: "PredatorySvc", amount: 35.99, category: "Software", isPredatory: false },
    { id: 102, date: "2024-12-10", merchant: "QuickLoan Express", amount: 249.99, category: "Finance", isPredatory: false },
    { id: 103, date: "2024-12-08", merchant: "Adobe Creative Cloud", amount: 59.99, category: "Software", isPredatory: false },
    { id: 104, date: "2024-12-05", merchant: "McAfee Total Protection", amount: 99.99, category: "Security", isPredatory: false },
    { id: 105, date: "2024-12-01", merchant: "Identity Guard Premium", amount: 19.99, category: "Security", isPredatory: false },
    { id: 106, date: "2024-11-24", merchant: "TechSupport Helpline", amount: 14.99, category: "Services", isPredatory: false },

    // --- OTHER RECENT ---
    { id: 10, date: "2024-12-30", merchant: "Hulu + Live TV", amount: 82.99, category: "Entertainment", isPredatory: false },
    { id: 11, date: "2024-12-28", merchant: "Microsoft 365", amount: 12.99, category: "Software", isPredatory: false },
    { id: 12, date: "2024-12-26", merchant: "Audible Premium", amount: 14.95, category: "Entertainment", isPredatory: false },
    { id: 14, date: "2024-12-22", merchant: "Disney+ Bundle", amount: 19.99, category: "Entertainment", isPredatory: false },
    { id: 15, date: "2024-12-20", merchant: "NYT Digital", amount: 17.00, category: "News", isPredatory: false },
    { id: 16, date: "2024-12-18", merchant: "Dropbox Plus", amount: 11.99, category: "Software", isPredatory: false },
    { id: 17, date: "2024-12-15", merchant: "Planet Fitness", amount: 24.99, category: "Health", isPredatory: false },
    { id: 18, date: "2024-12-12", merchant: "LinkedIn Premium", amount: 59.99, category: "Career", isPredatory: false },
];

// Helper function to format transactions for AI context
// Accepts live transaction data as parameter for dynamic updates
export function formatTransactionsForAI(txList: Transaction[] = transactions): string {
    return txList.map(t => {
        const flagStatus = t.isPredatory ? `[FLAGGED: ${t.predatoryReason}]` : "[OK]";
        return `- ${t.date}  $${t.amount.toFixed(2)}  ${t.merchant}  ${flagStatus}`;
    }).join('\n');
}

// Helper function to get flagged transactions summary WITH historical context
// Accepts live transaction data as parameter for dynamic updates
export function getFlaggedSummary(txList: Transaction[] = transactions): string {
    const flagged = txList.filter(t => t.isPredatory);
    if (flagged.length === 0) return "No alerts.";

    return flagged.map(flaggedTx => {
        // Find the OLDEST non-flagged transaction for this merchant (historical baseline)
        const history = txList.filter(t =>
            t.merchant === flaggedTx.merchant &&
            !t.isPredatory &&
            new Date(t.date) < new Date(flaggedTx.date)
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (history.length > 0) {
            const oldTx = history[0]; // Oldest historical entry
            const priceChange = ((flaggedTx.amount - oldTx.amount) / oldTx.amount * 100).toFixed(0);
            return `- ${flaggedTx.merchant}: On ${oldTx.date}, it cost $${oldTx.amount.toFixed(2)}. On ${flaggedTx.date}, it charged $${flaggedTx.amount.toFixed(2)} — a ${priceChange}% increase. Reason: ${flaggedTx.predatoryReason}`;
        } else {
            // No history found, just return the reason
            return `- ${flaggedTx.merchant}: ${flaggedTx.predatoryReason}`;
        }
    }).join('\n');
}
