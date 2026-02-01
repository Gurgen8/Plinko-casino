import Matter from 'matter-js';
import { COLORS, MULTIPLIERS } from '../constants/board';
import type { CustomBody } from '../types/physics';

export const createSlots = (rows: number, spacing: number, width: number) => {
    const multipliers = MULTIPLIERS[rows];
    if (!multipliers) throw new Error(`Multipliers not defined for ${rows} rows`);

    const count = multipliers.length;
    // Calculation must match createPins
    // lastRowPins = rows + 3 - 1? No.
    // row 0: 3 pins.
    // row i: i+3 pins.
    // row 15: 18 pins.
    // spacing.
    // Last row width (pin center to pin center): (18-1) * spacing = 17 * spacing.
    // startX of last row: (width - 17*spacing)/2.

    const lastRowPins = rows + 3; // For row index = rows - 1 ??? No. Row index 0 has 3 pins. Row index 15 has 18 pins.
    // Correct.

    const lastRowWidth = (lastRowPins - 1) * spacing;
    const startX = (width - lastRowWidth) / 2;
    const pinStartY = 50;
    const y = pinStartY + rows * spacing; // Position slots below the last row

    const slots: CustomBody[] = [];
    const height = 60; // Slot height
    const walls: Matter.Body[] = [];

    const bucketWidth = spacing;

    for (let i = 0; i < count; i++) {
        // Gap i is between pin i and pin i+1 of the last row?
        // Last row has 18 pins. 17 intervals.
        // Interval 0 center: startX + 0.5*spacing.
        // This matches. 

        const x = startX + i * spacing + spacing / 2;

        const slot = Matter.Bodies.rectangle(x, y + height / 2, bucketWidth * 0.6, height * 0.5, {
            isStatic: true,
            isSensor: true,
            label: `slot-${i}`,
            render: { fillStyle: 'transparent' }
        }) as CustomBody;

        slot.plugin = {
            type: 'slot',
            value: multipliers[i],
            index: i
        };
        slots.push(slot);

        // Separators
        const wall = Matter.Bodies.rectangle(x - spacing / 2, y + height / 2, 2, height, {
            isStatic: true,
            render: { fillStyle: COLORS.wall },
            label: 'wall',
            chamfer: { radius: 0 }
        }) as CustomBody;
        wall.plugin = { type: 'wall' };
        walls.push(wall);

        if (i === count - 1) {
            const rightWall = Matter.Bodies.rectangle(x + spacing / 2, y + height / 2, 2, height, {
                isStatic: true,
                render: { fillStyle: COLORS.wall },
                label: 'wall'
            }) as CustomBody;
            rightWall.plugin = { type: 'wall' };
            walls.push(rightWall);
        }
    }

    // Bottom Floor
    const floor = Matter.Bodies.rectangle(width / 2, y + height + 10, width, 20, {
        isStatic: true,
        label: 'floor',
        render: { fillStyle: COLORS.wall }
    });

    return { slots, walls: [...walls, floor] };
};
