import React from 'react';
import type { HistoryItem } from '../types/game';

interface Props {
    history: HistoryItem[];
}

export const ResultPanel: React.FC<Props> = ({ history }) => {
    return (
        <div className="history-panel">
            <h3>Recent Plays</h3>
            <div className="history-list">
                {history.map((item) => (
                    <div key={item.id} className={`history-item ${item.multiplier > 1 ? 'win' : 'loss'}`}>
                        <div className="multiplier-badge">{item.multiplier}x</div>
                        <div className="payout-amount">${item.payout.toFixed(2)}</div>
                    </div>
                ))}
                {history.length === 0 && <div className="no-history">No plays yet</div>}
            </div>
        </div>
    );
};
