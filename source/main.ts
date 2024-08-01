import * as AppStorage from "./storage/app_storage";
import * as Options from "./storage/options";
import * as MainMenu from "./menu/main_menu";
import * as HighScore from "./storage/high_score";
import * as Game from "./game/game";
import * as Preload from "./other/preload";
import * as Message from "./other/message";
import * as Canvas from "./game/canvas";

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

    Game.init({ canvas, onQuit: () => MainMenu.open("mainMenu") });

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
