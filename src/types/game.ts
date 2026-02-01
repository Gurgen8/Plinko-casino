export interface HistoryItem {
    id: string;
    multiplier: number;
    bet: number;
    payout: number;
    timestamp: number;
}

export interface GameState {
    balance: number;
    bet: number;
    history: HistoryItem[];
    lastWin: {
        multiplier: number;
        payout: number;
    } | null;
}

export type GameStatus = 'IDLE' | 'PLAYING';
