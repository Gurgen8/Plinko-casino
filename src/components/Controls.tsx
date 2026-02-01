import React from 'react';

interface ControlsProps {
    balance: number;
    bet: number;
    setBet: (val: number) => void;
    onDrop: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ balance, bet, setBet, onDrop }) => {
    return (
        <div className="controls-panel">
            <div className="balance-display">
                <span className="label">Balance</span>
                <span className="value">${balance.toFixed(2)}</span>
            </div>

            <div className="bet-control">
                <label>Bet Amount</label>
                <div className="input-row">
                    <input
                        type="number"
                        value={bet}
                        onChange={(e) => setBet(Math.max(1, Number(e.target.value)))}
                        min="1"
                    />
                    <button className="multiplier-btn" onClick={() => setBet(Math.max(1, Math.floor(bet / 2)))}>½</button>
                    <button className="multiplier-btn" onClick={() => setBet(bet * 2)}>2x</button>
                </div>
            </div>

            <button
                className="drop-button"
                onClick={onDrop}
                disabled={balance < bet}
            >
                DROP BALL
            </button>
        </div>
    );
};
