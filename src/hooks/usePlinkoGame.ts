import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { initEngine } from '../physics/engine';
import { createPins } from '../physics/createPins';
import { createSlots } from '../physics/createSlots';
import { createBall } from '../physics/createBall';
import type { GameState, HistoryItem } from '../types/game';
import type { CustomBody } from '../types/physics';
import { BOARD_WIDTH, BOARD_HEIGHT, ROWS } from '../constants/board';

export const usePlinkoGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);

    const [lastHitIndex, setLastHitIndex] = useState<number | null>(null);

    const [gameState, setGameState] = useState<GameState>({
        balance: 1000, // Initial balance
        bet: 10,
        history: [],
        lastWin: null
    });

    const calculateWin = useCallback((ball: CustomBody, slot: CustomBody) => {
        const Multiplier = slot.plugin.value || 0;
        const Bet = ball.plugin.betValue || 0;
        const WinAmount = Bet * Multiplier;

        if (slot.plugin.index !== undefined) {
            setLastHitIndex(slot.plugin.index);
            setTimeout(() => setLastHitIndex(null), 300);
        }

        setGameState(prev => {
            const newHistory: HistoryItem = {
                id: ball.plugin.id || 'unknown',
                multiplier: Multiplier,
                bet: Bet,
                payout: WinAmount,
                timestamp: Date.now()
            };

            return {
                ...prev,
                balance: prev.balance + WinAmount,
                history: [newHistory, ...prev.history].slice(0, 5), // Keep last 5
                lastWin: { multiplier: Multiplier, payout: WinAmount }
            };
        });
    }, []);

    // Initialize Physics
    useEffect(() => {
        if (!engineRef.current) {
            const engine = initEngine();
            const world = engine.world;
            engineRef.current = engine;

            // Add Pins
            const { pins, spacing } = createPins(ROWS, BOARD_WIDTH);
            Matter.World.add(world, pins);

            // Add Slots
            const { slots, walls } = createSlots(ROWS, spacing, BOARD_WIDTH);
            Matter.World.add(world, [...slots, ...walls]);

            // Runner
            const runner = Matter.Runner.create();
            Matter.Runner.run(runner, engine);
            runnerRef.current = runner;

            // Collision Events
            Matter.Events.on(engine, 'collisionStart', (event) => {
                const pairs = event.pairs;
                pairs.forEach((pair) => {
                    const bodyA = pair.bodyA as CustomBody;
                    const bodyB = pair.bodyB as CustomBody;

                    // Check Ball <-> Slot collision
                    if (bodyA.plugin.type === 'ball' && bodyB.plugin.type === 'slot') {
                        if (!bodyA.plugin.processed) {
                            bodyA.plugin.processed = true;
                            calculateWin(bodyA, bodyB);
                            // Remove ball after short delay or immediately? 
                            // Usually immediately to keep board clean or let it sink?
                            // Since slot is a sensor, ball passes through.
                            // We should remove it once it passes the screen or add a "Destroyer" sensor below.
                            // But removing here works for logic.
                            // Let's remove it visually slightly later to avoid instant disappear
                            // Or just rely on a floor sensor.
                            // Wait, slot is sensor. Ball falls through.
                        }
                    } else if (bodyB.plugin.type === 'ball' && bodyA.plugin.type === 'slot') {
                        if (!bodyB.plugin.processed) {
                            bodyB.plugin.processed = true;
                            calculateWin(bodyB, bodyA);
                        }
                    }
                });
            });

            // Cleanup sensor for balls falling out
            Matter.Events.on(engine, 'afterUpdate', () => {
                const balls = Matter.Composite.allBodies(engine.world).filter(b => (b as CustomBody).plugin.type === 'ball');
                balls.forEach(ball => {
                    if (ball.position.y > BOARD_HEIGHT + 100) {
                        Matter.World.remove(engine.world, ball);
                    }
                });
            });
        }

        // Render Loop
        let animationFrameId: number;
        const renderLoop = () => {
            const canvas = canvasRef.current;
            const engine = engineRef.current;

            if (canvas && engine) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Draw Bodies
                    const bodies = Matter.Composite.allBodies(engine.world);
                    bodies.forEach(body => {
                        const customBody = body as CustomBody;
                        ctx.beginPath();

                        if (customBody.label.includes('circle') || customBody.plugin.type === 'ball' || customBody.plugin.type === 'pin') {
                            ctx.arc(body.position.x, body.position.y, body.circleRadius || 5, 0, 2 * Math.PI);
                        } else {
                            // Rectangles (Walls, Slots)
                            // Matter.js bodies vertices
                            ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
                            for (let j = 1; j < body.vertices.length; j += 1) {
                                ctx.lineTo(body.vertices[j].x, body.vertices[j].y);
                            }
                            ctx.fillStyle = body.render.fillStyle || '#fff';
                        }

                        ctx.fillStyle = body.render.fillStyle || '#fff';
                        ctx.fill();

                        // Draw Text for Slots
                        // Draw Text for Slots - REMOVED, using React Components
                        /*
                        if (customBody.plugin.type === 'slot' && customBody.plugin.value) {
                             ctx.fillStyle = COLORS.text;
                             ctx.font = 'bold 12px Arial';
                             ctx.textAlign = 'center';
                             ctx.fillText(`${customBody.plugin.value}x`, body.position.x, body.position.y + 5);
                        }
                        */
                    });
                }
            }
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        return () => {
            if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
            if (engineRef.current) Matter.Engine.clear(engineRef.current);
            cancelAnimationFrame(animationFrameId);
            // Don't null engineRef immediately if we want to preserve state? No, full cleanup.
            engineRef.current = null;
        };
    }, [calculateWin]);

    const handleDrop = useCallback(() => {
        if (gameState.balance >= gameState.bet && engineRef.current) {
            setGameState(prev => ({ ...prev, balance: prev.balance - prev.bet }));

            const ball = createBall(BOARD_WIDTH);
            ball.plugin.betValue = gameState.bet;
            Matter.World.add(engineRef.current.world, ball);
        }
    }, [gameState.balance, gameState.bet]);

    const setBet = useCallback((value: number) => {
        setGameState(prev => ({ ...prev, bet: value }));
    }, []);

    return {
        canvasRef,
        ...gameState,
        onDrop: handleDrop,
        setBet,
        lastHitIndex
    };
};
