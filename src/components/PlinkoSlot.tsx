import React, { useEffect, useState } from 'react';
import { COLORS } from '../constants/board';

interface Props {
    multiplier: number;
    active: boolean;
}

export const PlinkoSlot: React.FC<Props> = ({ multiplier, active }) => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (active) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [active]);

    // Determine color based on risk/multiplier
    const getBackgroundColor = (mult: number) => {
        if (mult < 1) return COLORS.slots.low;
        if (mult < 3) return COLORS.slots.medium;
        if (mult < 10) return COLORS.slots.high;
        return COLORS.slots.extreme;
    };

    return (
        <div
            className={`plinko-slot ${animate ? 'active' : ''}`}
            style={{
                backgroundColor: getBackgroundColor(multiplier),
                boxShadow: animate ? `0 0 20px ${getBackgroundColor(multiplier)}` : 'none',
                borderColor: animate ? '#fff' : 'transparent',
                transform: animate ? 'scale(1.15) translateY(4px)' : 'scale(1)',
                transition: 'all 0.1s ease-out'
            }}
        >
            <span className="multiplier-text">{multiplier}x</span>
        </div>
    );
};
