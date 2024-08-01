export interface OptionsData {
    columns: number;
    lines: number;
    frameOn: boolean;
    wallInterval: number; // the intervals are in milliseconds
    appleInterval: number;
    orangeInterval: number;
    bananaInterval: number;
    snakeSpeed: number; // is in Hz (movement frequency)
}

export type OptionsKey = keyof OptionsData;

// only the keys that result in the specified type
export type KeysOfType<T, TProp> = {
    [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T];

export interface Score {
    numberOfTails: number;
    time: number; // in milliseconds
    options: OptionsData;
}

// dictionary where the key is the map name and the value is an array of scores
// has all the scores sorted descending order
export interface MapScores {
    [mapName: string]: Score[];
}
