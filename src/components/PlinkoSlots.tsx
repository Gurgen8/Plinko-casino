import React from 'react';
import { PlinkoSlot } from './PlinkoSlot';
import { MULTIPLIERS, ROWS, BOARD_WIDTH } from '../constants/board';

interface Props {
    lastHitIndex: number | null;
}

export const PlinkoSlots: React.FC<Props> = ({ lastHitIndex }) => {
    // We use the multipliers for the configured row count
    const multipliers = MULTIPLIERS[ROWS];
    const spacing = BOARD_WIDTH / (ROWS + 2);

    // Physics Logic Replication:
    // lastRowPins = ROWS + 3 = 19
    // lastRowWidth = (19 - 1) * spacing = 18 * spacing
    // startX = (BOARD_WIDTH - 18 * spacing) / 2
    // CreateSlots loop: x = startX + i * spacing + spacing/2
    // So visualization should start at startX.

    const lastRowPins = ROWS + 2;
    const lastRowWidth = (lastRowPins - 1) * spacing;
    const startX = (BOARD_WIDTH - lastRowWidth) / 2;
    const startY = 50 + ROWS * spacing; // Base Y position from physics

    return (
        <div
            className="plinko-slots-container"
            style={{
                position: 'absolute',
                top: `${startY}px`,
                left: `${startX}px`,
                width: `${lastRowWidth}px`, // This should cover the slots area perfectly
                display: 'flex',
                // Physics has spacing/2 offset? 
                // x = startX + i*spacing + spacing/2.
                // If we display blocks of width `spacing`, centered at that x.
                // Then left edge = x - spacing/2 = startX + i*spacing.
                // So yes, we just stack them from startX.
            }}
        >
            <div className="slots-row" style={{ display: 'flex', width: '100%' }}>
                {multipliers.map((mult, index) => (
                    // Add padding to create gap between slots, simulating walls visibility
                    <div key={index} style={{ width: spacing, height: '40px', padding: '0 4px', marginTop: '20px' }}>
                        <PlinkoSlot
                            multiplier={mult}
                            active={lastHitIndex === index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
