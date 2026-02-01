export const BOARD_WIDTH = 800;
export const BOARD_HEIGHT = 900;

export const PIN_RADIUS = 5;
export const PIN_SIZE = 5;
export const BALL_RADIUS = 8;

// Reduce row count slightly for better fit if needed, but 16 is standard.
export const ROWS = 16;

export const ENGINE_DEFAULTS = {
    gravity: { x: 0, y: 1, scale: 0.001 },
    timing: { timeScale: 1 }
};

// Colors scheme - Dark Premium
export const COLORS = {
    background: '#0F172A', // Slate 900
    pin: '#E2E8F0',        // Slate 200
    ball: '#F43F5E',       // Rose 500
    wall: '#334155',       // Slate 700
    text: '#F8FAFC',       // Slate 50
    primary: '#6366F1',    // Indigo 500
    secondary: '#10B981',  // Emerald 500
    slots: {
        low: '#F59E0B',    // Amber 500
        medium: '#F97316', // Orange 500
        high: '#EF4444',   // Red 500
        extreme: '#D946EF' // Fuchsia 500
    }
} as const;

// Multipliers configuration
// Standard Plinko distribution (symmetric)
export const MULTIPLIERS: { [key: number]: number[] } = {
    16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]
};
