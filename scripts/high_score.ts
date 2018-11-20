import * as AppStorage from './app_storage.js';
import * as Options from './options.js';
import { MapName } from './main.js';


interface Score {
    numberOfTails: number;
    time: string;
    options: Options.OptionsData;
}

// dictionary where the key is the map name and the value is an array of scores
// has all the scores sorted descending order
interface MapScores {
    [ mapName: string ]: Score[];
}

var HIGH_SCORE: MapScores = {};

// number of scores to save (just save the best ones)
var HIGH_SCORE_LENGTH = 5;


/**
 * Load the scores from local storage.
 */
export function load( score: MapScores ) {
    if ( score ) {
        HIGH_SCORE = score;
    }
}


/**
 * Save to local storage.
 */
export function save() {
    AppStorage.setData( { snake_high_score: HIGH_SCORE } );
}


/**
 * Add a score. Its only going to be saved it it happens to be a high-score.
 */
export function add( mapName: MapName, numberOfTails: number, time: string ) {
    // the snake always has 1 tail, so only consider scores above that (where you actually played the game)
    if ( numberOfTails <= 1 ) {
        return;
    }

    var scoreArray = HIGH_SCORE[ mapName ];
    const options = Options.clone();

    if ( typeof scoreArray === 'undefined' ) {
        scoreArray = [];
        HIGH_SCORE[ mapName ] = scoreArray;
    }

    scoreArray.push( {
        numberOfTails: numberOfTails,
        time: time,
        options: options
    } );

    scoreArray.sort( function ( a, b ) {
        return b.numberOfTails - a.numberOfTails;
    } );

    // if we passed the limit, remove the last one (the lesser score)
    if ( scoreArray.length > HIGH_SCORE_LENGTH ) {
        scoreArray.pop();
    }
}


export function getMapScores( mapName: MapName ) {
    return HIGH_SCORE[ mapName ];
}
