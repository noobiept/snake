import * as AppStorage from "./storage/app_storage.js";
import * as Options from "./storage/options.js";
import * as MainMenu from "./menu/main_menu.js";
import * as HighScore from "./storage/high_score.js";
import * as GameMenu from "./game/game_menu.js";
import * as Game from "./game/game.js";
import * as Preload from "./other/preload.js";
import * as Message from "./other/message.js";
import * as Canvas from "./game/canvas.js";

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

/**
 * Starting point of the application.
 */
window.onload = function () {
    Message.init();
    Message.show("Loading...");

    AppStorage.getData(
        [
            "snake_high_score",
            "snake_options",
            "snake_has_run_before",
            "snake_selected_map",
        ],
        function (data) {
            initApp(data);

            Message.hide();
            Canvas.showHideCanvas(false);
        }
    );
};

/**
 * Load the application with the 'data' we got from the storage.
 */
function initApp(data: AppStorage.StorageData) {
    Options.load(data["snake_options"]);

    // setup the canvas
    const canvas = Canvas.init();

    Canvas.updateCanvasDimensions();

    // use the 'requestAnimationFrame' timing mode, and use the 'delta' values to control the game timings
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    HighScore.load(data["snake_high_score"]);
    MainMenu.init(data["snake_selected_map"]);
    GameMenu.init();
    Game.init(canvas);

    let callback;

    // on the first run of the program, show the help page
    if (!data["snake_has_run_before"]) {
        AppStorage.setData({ snake_has_run_before: true });
        callback = () => {
            MainMenu.open("help");
        };
    } else {
        callback = () => {
            MainMenu.open("mainMenu");
        };
    }

    Preload.init(callback);
}
