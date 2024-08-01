import type { GridItem } from "./grid.types";

export interface CollisionElements {
    a: GridItem;
    b: GridItem;
}

export type GameInitArgs = {
    canvas: HTMLCanvasElement;
    onQuit: () => void;
};

export interface TickEvent {
    target: object;
    type: string;
    paused: boolean;
    delta: number; // time elapsed in ms since the last tick
    time: number; // total time in ms since 'Ticker' was initialized
    runTime: number;
}
