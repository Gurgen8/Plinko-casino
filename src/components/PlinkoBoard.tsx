import React from 'react';
import type { RefObject } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../constants/board';

interface Props {
    // Correctly typing the ref from useRef<HTMLCanvasElement>(null)
    canvasRef: RefObject<HTMLCanvasElement | null>;
}

export const PlinkoBoard: React.FC<Props> = ({ canvasRef }) => {
    return (
        <div className="game-board">
            <canvas
                ref={canvasRef}
                width={BOARD_WIDTH}
                height={BOARD_HEIGHT}
                className="plinko-canvas"
            />
        </div>
    );
};
