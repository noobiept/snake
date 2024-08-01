import type { Dict } from "../types";
import type { MapScores, OptionsData } from "./storage.types";

// what gets saved/loaded to/from local storage
export interface StorageData {
    snake_high_score?: MapScores;
    snake_options?: OptionsData;
    snake_has_run_before?: boolean;
    snake_selected_map?: string;
}

/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `localStorage`.
 */
export function getData(
    keys: (keyof StorageData)[],
    callback: (objects: StorageData) => void
) {
    const objects: Dict = {};

    for (let a = 0; a < keys.length; a++) {
        const key = keys[a];
        const value = localStorage.getItem(key);

        objects[key] = value && JSON.parse(value);
    }

    callback(objects);
}

/**
 * Sets the given key/value into `localStorage`. Calls the `callback` when its done.
 * Converts the value to string (with json).
 */
export function setData(items: StorageData, callback?: () => void) {
    for (const key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {
            const dataKey = key as keyof StorageData;
            const item = items[dataKey];

            localStorage.setItem(key, JSON.stringify(item));
        }
    }

    if (callback) {
        callback();
    }
}
