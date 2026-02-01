import Matter from 'matter-js';
import { BALL_RADIUS, COLORS, BOARD_WIDTH } from '../constants/board';
import type { CustomBody } from '../types/physics';

export const createBall = (width: number = BOARD_WIDTH) => {
    // Add randomness to x position to ensure outcome variability
    // +/- 5 pixels jitter is usually enough to create full normal distribution in Plinko
    const jitter = (Math.random() - 0.5) * 10;
    const x = width / 2 + jitter;
    const y = 20;

    // Create unique ID
    const id = Date.now().toString() + Math.random().toString().substring(2, 5);

    const ball = Matter.Bodies.circle(x, y, BALL_RADIUS, {
        restitution: 0.8, // Bounciness
        friction: 0.6,
        frictionAir: 0.04, // IMPORTANT: Prevents excessive acceleration
        density: 0.05,
        render: { fillStyle: COLORS.ball },
        label: `ball-${id}`
    }) as CustomBody;

    ball.plugin = {
        type: 'ball',
        id,
        processed: false
    };

    return ball;
};
