import * as AppStorage from './app_storage.js';
import * as Options from './options.js';
import { MapName } from './main.js';


export interface Score {
    numberOfTails: number;
    time: number;   // in milliseconds
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
 * Determine if we have a valid 'MapScores' object.
 */
function isMapScores( object: any ): object is MapScores {
    if ( object ) {
        const keys = Object.keys( object );

        for ( let a = 0; a < keys.length; a++ ) {
            const mapName = keys[ a ];
            const mapScores = object[ mapName ];

            if ( !Array.isArray( mapScores ) ) {
                return false;
            }

            for ( let b = 0; b < mapScores.length; b++ ) {
                const score = mapScores[ b ];

                if ( !( score instanceof Object ) ||
                    !score.hasOwnProperty( 'numberOfTails' ) ||
                    !score.hasOwnProperty( 'time' ) ||
                    !score.hasOwnProperty( 'options' ) ) {
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
export function load( score?: any ) {
    if ( isMapScores( score ) ) {
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
export function add( mapName: MapName, numberOfTails: number, time: number ) {
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
