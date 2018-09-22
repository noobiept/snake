import * as AppStorage from './app_storage.js';
import * as Options from './options.js';
import * as MainMenu from './main_menu.js';
import * as HighScore from './high_score.js';
import * as GameMenu from './game_menu.js';
import * as Game from './game.js';
import * as Preload from './preload.js';
import Snake from './snake.js';


// the elements type in the game (useful to identify objects, call .getType() )
export enum ElementsType {
    tail,
    snake
}

export enum Direction {
    left,
    right,
    up,
    down
}

export interface Path {
    x: number;
    y: number;
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

export type MapName = 'random' | 'stairs' | 'lines' | 'empty';

// createjs
export var STAGE: createjs.Stage;

// the canvas element where the game is drawn in
var CANVAS: HTMLCanvasElement;


window.onload = function () {
    AppStorage.getData( [ 'snake_high_score', 'snake_options', 'snake_has_run_before', 'snake_selected_map' ], initApp );
};


function initApp( data: Dict ) {
    Options.load( data[ 'snake_options' ] );

    // setup the canvas
    CANVAS = <HTMLCanvasElement> document.querySelector( '#MainCanvas' );
    CANVAS.width = Options.getCanvasWidth();
    CANVAS.height = Options.getCanvasHeight();

    // :: createjs stuff :: //
    STAGE = new createjs.Stage( CANVAS );

    createjs.Ticker.interval = 50;
    createjs.Ticker.on( 'tick', tick );

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


window.onkeydown = function ( event ) {
    var returnValue;

    for ( var i = 0; i < Snake.ALL_SNAKES.length; i++ ) {
        returnValue = Snake.ALL_SNAKES[ i ].onKeyDown( event.keyCode );

        if ( !returnValue ) {
            return returnValue;
        }
    }

    return true;
};


window.onkeyup = function ( event ) {
    var returnValue;

    for ( var i = 0; i < Snake.ALL_SNAKES.length; i++ ) {
        returnValue = Snake.ALL_SNAKES[ i ].onKeyUp( event.keyCode );

        if ( !returnValue ) {
            return returnValue;
        }
    }

    return true;
};


export function pause() {
    createjs.Ticker.paused = true;
}


export function resume() {
    createjs.Ticker.paused = false;
}


/**
 * Change the width/height of the canvas element where the game is drawn.
 * Pass 'undefined' if you don't want to change one of them.
 */
export function changeCanvasDimensions( width?: number, height?: number ) {
    if ( width ) {
        CANVAS.width = width;
    }

    if ( height ) {
        CANVAS.height = height;
    }
}


function tick( event: Dict ) {
    if ( event.paused ) {
        return;
    }

    var snakeObject;

    for ( var i = 0; i < Snake.ALL_SNAKES.length; i++ ) {
        snakeObject = Snake.ALL_SNAKES[ i ];
        snakeObject.tick();
    }

    Snake.checkCollision();
    STAGE.update();
}
