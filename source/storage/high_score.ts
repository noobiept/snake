import type { MapName } from "../types";
import * as AppStorage from "./app_storage";
import * as Options from "./options";
import type { MapScores } from "./storage.types";

let HIGH_SCORE: MapScores = {};

// number of scores to save (just save the best ones)
const HIGH_SCORE_LENGTH = 5;

/**
 * Determine if we have a valid `MapScores` object.
 */
function isMapScores(arg: unknown): arg is MapScores {
    if (arg && typeof arg === "object") {
        const object = arg as Record<string, unknown>;
        const keys = Object.keys(object);

        for (let a = 0; a < keys.length; a++) {
            const mapName = keys[a];
            const mapScores = object[mapName];

            if (!Array.isArray(mapScores)) {
                return false;
            }

            for (let b = 0; b < mapScores.length; b++) {
                const score = mapScores[b];

                if (
                    !(score instanceof Object) ||
                    !Object.prototype.hasOwnProperty.call(
                        score,
                        "numberOfTails"
                    ) ||
                    !Object.prototype.hasOwnProperty.call(score, "time") ||
                    !Object.prototype.hasOwnProperty.call(score, "options")
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    return false;
}

/**
 * Load the scores from local storage.
 */
export function load(score?: unknown) {
    if (isMapScores(score)) {
        HIGH_SCORE = score;
    }
}

/**
 * Save to local storage.
 */
export function save() {
    AppStorage.setData({ snake_high_score: HIGH_SCORE });
}

/**
 * Add a score. Its only going to be saved it it happens to be a high-score.
 */
export function add(mapName: MapName, numberOfTails: number, time: number) {
    // the snake always has 1 tail, so only consider scores above that (where you actually played the game)
    if (numberOfTails <= 1) {
        return;
    }

    let scoreArray = HIGH_SCORE[mapName];
    const options = Options.clone();
    const intTime = Math.round(time);

    if (typeof scoreArray === "undefined") {
        scoreArray = [];
        HIGH_SCORE[mapName] = scoreArray;
    }

    scoreArray.push({
        numberOfTails: numberOfTails,
        time: intTime,
        options: options,
    });

    scoreArray.sort(function (a, b) {
        return b.numberOfTails - a.numberOfTails;
    });

    // if we passed the limit, remove the last one (the lesser score)
    if (scoreArray.length > HIGH_SCORE_LENGTH) {
        scoreArray.pop();
    }
}

/**
 * Get all the scores of the given map.
 */
export function getMapScores(mapName: MapName) {
    return HIGH_SCORE[mapName];
}
