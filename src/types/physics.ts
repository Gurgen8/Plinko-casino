import { Body } from 'matter-js';

export type EntityType = 'ball' | 'pin' | 'wall' | 'slot' | 'sensor';

// We can't strictly extend Matter.Body easily in TS without module augmentation or intersection
// but we can define what we expect in the `plugin` property.
export interface CustomBody extends Body {
    plugin: {
        type: EntityType;
        value?: number; // For slots (multiplier)
        betValue?: number; // For balls (to calculate win)
        id?: string;    // For balls
        index?: number; // For slots (0 to N)
        processed?: boolean; // To mark that a ball has been processed by a slot
    }
}
