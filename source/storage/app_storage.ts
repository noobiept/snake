import { Dict } from "../main.js";
import { OptionsData } from "./options.js";
import { MapScores } from "./high_score.js";

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
    var objects: Dict = {};

    for (var a = 0; a < keys.length; a++) {
        var key = keys[a];
        var value = localStorage.getItem(key);

        objects[key] = value && JSON.parse(value);
    }

    callback(objects);
}

/**
 * Sets the given key/value into `localStorage`. Calls the `callback` when its done.
 * Converts the value to string (with json).
 */
export function setData(items: StorageData, callback?: () => void) {
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            const dataKey = key as keyof StorageData;
            const item = items[dataKey];

            localStorage.setItem(key, JSON.stringify(item));
        }
    }

    if (callback) {
        callback();
    }
}
