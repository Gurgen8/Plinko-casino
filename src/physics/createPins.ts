import Matter from 'matter-js';
import { PIN_RADIUS, COLORS } from '../constants/board';
import type { CustomBody } from '../types/physics';

export const createPins = (rows: number, width: number) => {
    const pins: Matter.Body[] = [];
    const spacing = width / (rows + 2);
    const startY = 50;

    for (let r = 0; r < rows; r++) {
        const linePins = r + 3;
        const lineWidth = (linePins - 1) * spacing;
        const startX = (width - lineWidth) / 2;

        for (let c = 0; c < linePins; c++) {
            const x = startX + c * spacing;
            const y = startY + r * spacing;

            const pin = Matter.Bodies.circle(x, y, PIN_RADIUS, {
                isStatic: true,
                render: { fillStyle: COLORS.pin },
                label: 'pin',
                friction: 0,
                restitution: 1
            }) as CustomBody;

            pin.plugin = { type: 'pin' };

            pins.push(pin);
        }
    }
    return { pins, spacing };
};
