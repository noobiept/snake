import * as AppStorage from './app_storage.js';
import { changeCanvasDimensions } from './main.js';


interface OptionsData {
    columns: number;
    lines: number;
    frameOn: boolean;
    difficulty: Difficulty;
}

export enum Difficulty {
    normal = 0,
    hard = 1
};

var OPTIONS: OptionsData = {
    columns: 50,
    lines: 50,
    frameOn: false,
    difficulty: Difficulty.normal
};


export function load( options: OptionsData ) {
    if ( options ) {
        if ( Number.isInteger( options.columns ) ) {
            OPTIONS.columns = options.columns;
        }

        if ( Number.isInteger( options.lines ) ) {
            OPTIONS.lines = options.lines;
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


export function setColumns( columns: number ) {
    OPTIONS.columns = columns;

    changeCanvasDimensions( columns, OPTIONS.lines );
}


export function getColumns() {
    return OPTIONS.columns;
}


export function setLines( lines: number ) {
    OPTIONS.lines = lines;

    changeCanvasDimensions( OPTIONS.columns, lines );
}


export function getLines() {
    return OPTIONS.lines;
}


export function setFrame( yesNo: boolean ) {
    OPTIONS.frameOn = yesNo;
}


export function getFrame() {
    return OPTIONS.frameOn;
}
