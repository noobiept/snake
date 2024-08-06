export enum Direction {
    west,
    east,
    north,
    south,
    northWest,
    northEast,
    southWest,
    southEast,
}

export interface Path {
    column: number;
    line: number;
    direction: Direction;
}

export interface KeyboardMapping {
    left: string;
    left2?: string;
    right: string;
    right2?: string;
    up: string;
    up2?: string;
    down: string;
    down2?: string;
}

export interface Dict {
    [key: string]: unknown;
}

export type MapName =
    | "random"
    | "randomDiagonal"
    | "randomSingle"
    | "stairs"
    | "lines"
    | "empty";

export type AssetName = "orange" | "apple" | "banana";
