import * as AppStorage from './storage/app_storage.js';
import * as Options from './storage/options.js';
import * as MainMenu from './menu/main_menu.js';
import * as HighScore from './storage/high_score.js';
import * as GameMenu from './game/game_menu.js';
import * as Game from './game/game.js';
import * as Preload from './other/preload.js';
import * as  Message from "./other/message.js";
import { Grid } from "./game/grid.js";


export enum Direction {
    west,
    east,
    north,
    south,
    northWest,
    northEast,
    southWest,
    southEast
}

export interface Path {
    column: number;
    line: number;
    direction: Direction;
}

export interface KeyboardMapping {
    left: number;
    left2?: number;
    right: number;
    right2?: number;
    up: number;
    up2?: number;
    down: number;
    down2?: number;
}

export interface Dict {
    [ key: string ]: any;
}

export type MapName = 'random' | 'randomDiagonal' | 'randomSingle' | 'stairs' | 'lines' | 'empty';

export var STAGE: createjs.Stage;

// the canvas element where the game is drawn in
var CANVAS: HTMLCanvasElement;


window.onload = function () {
    Message.init();
    Message.show( 'Loading...' );

    AppStorage.getData( [ 'snake_high_score', 'snake_options', 'snake_has_run_before', 'snake_selected_map' ], function ( data ) {
        initApp( data );

        Message.hide();
        showCanvas();
    } );
};


function initApp( data: AppStorage.StorageData ) {
    Options.load( data[ 'snake_options' ] );

    // setup the canvas
    CANVAS = <HTMLCanvasElement> document.querySelector( '#MainCanvas' );

    updateCanvasDimensions();

    // setup the stage
    STAGE = new createjs.Stage( CANVAS );

    // use the 'requestAnimationFrame' timing mode, and use the 'delta' values to control the game timings
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    HighScore.load( data[ 'snake_high_score' ] );
    MainMenu.init( data[ 'snake_selected_map' ] );
    GameMenu.init();
    Game.init();

    var callback;

    // on the first run of the program, show the help page
    if ( !data[ 'snake_has_run_before' ] ) {
        AppStorage.setData( { snake_has_run_before: true } );
        callback = () => { MainMenu.open( 'help' ) };
    }

    else {
        callback = () => { MainMenu.open( 'mainMenu' ) };
    }

    Preload.init( callback );
}


/**
 * Change the width/height of the canvas element where the game is drawn. The size is based on the number of columns/lines being used in the game.
 */
export function updateCanvasDimensions() {
    const columns = Options.get( 'columns' );
    const lines = Options.get( 'lines' );

    CANVAS.width = columns * Grid.size;
    CANVAS.height = lines * Grid.size;
}


/**
 * Show the canvas element.
 */
function showCanvas() {
    if ( CANVAS ) {
        CANVAS.classList.remove( 'hidden' );
    }
}
