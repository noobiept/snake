import { Grid } from "./grid";
import * as Options from "../storage/options";

let CANVAS: HTMLCanvasElement; // the canvas element where the game is drawn in

export function init() {
    CANVAS = <HTMLCanvasElement>document.querySelector("#MainCanvas");

    return CANVAS;
}

/**
 * Change the width/height of the canvas element where the game is drawn. The size is based on the number of columns/lines being used in the game.
 */
export function updateCanvasDimensions() {
    const columns = Options.get("columns");
    const lines = Options.get("lines");

    CANVAS.width = columns * Grid.size;
    CANVAS.height = lines * Grid.size;
}

/**
 * Show/hide the canvas element.
 */
export function showHideCanvas(show: boolean) {
    if (CANVAS) {
        if (show) {
            CANVAS.classList.remove("hidden");
        } else {
            CANVAS.classList.add("hidden");
        }
    }
}
