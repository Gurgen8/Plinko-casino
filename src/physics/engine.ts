import Matter from 'matter-js';
import { ENGINE_DEFAULTS } from '../constants/board';

export const initEngine = () => {
    const engine = Matter.Engine.create({
        ...ENGINE_DEFAULTS,
    }); // timing is inside usually

    // Reduce position iterations for better performance if needed, but defaults are usually fine
    // engine.positionIterations = 8;
    // engine.velocityIterations = 8;

    return engine;
};
