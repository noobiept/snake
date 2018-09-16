import * as AppStorage from './app_storage.js';
import { changeCanvasDimensions } from './main.js';


interface OptionsData {
    canvas_width: number;
    canvas_height: number;
    frameOn: boolean;
    difficulty: Difficulty;
}

export enum Difficulty {
    normal = 0,
    hard = 1
};

var OPTIONS: OptionsData = {
    canvas_width: 800,
    canvas_height: 400,
    frameOn: false,
    difficulty: Difficulty.normal
};


export function load( options: OptionsData ) {
    if ( options ) {
        if ( Number.isInteger( options.canvas_width ) ) {
            OPTIONS.canvas_width = options.canvas_width;
        }

        if ( Number.isInteger( options.canvas_height ) ) {
            OPTIONS.canvas_height = options.canvas_height;
        }

        if ( typeof options.frameOn !== 'undefined' ) {
            OPTIONS.frameOn = options.frameOn;
        }

        if ( typeof options.difficulty !== 'undefined' ) {
            OPTIONS.difficulty = options.difficulty;
        }
    }
}


export function save() {
    AppStorage.setData( { snake_options: OPTIONS } );
}


export function setDifficulty( difficulty: Difficulty ) {
    OPTIONS.difficulty = difficulty;
}


export function getDifficulty() {
    return OPTIONS.difficulty;
}


export function getDifficultyString() {
    return Difficulty[ OPTIONS.difficulty ];
}


export function setCanvasWidth( width: number ) {
    OPTIONS.canvas_width = width;

    changeCanvasDimensions( width );
}


export function getCanvasWidth() {
    return OPTIONS.canvas_width;
}


export function setCanvasHeight( height: number ) {
    OPTIONS.canvas_height = height;

    changeCanvasDimensions( undefined, height );
}


export function getCanvasHeight() {
    return OPTIONS.canvas_height;
}


export function setFrame( yesNo: boolean ) {
    OPTIONS.frameOn = yesNo;
}


export function getFrame() {
    return OPTIONS.frameOn;
}
