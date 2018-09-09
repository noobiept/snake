import * as AppStorage from './app_storage.js';
import * as Options from './options.js';
import { MapName } from './main.js';
import { boolToOnOff } from './utilities.js';


interface Score {
    numberOfTails: number;
    difficulty: string;
    frame: string;
    canvasWidth: number;
    canvasHeight: number;
    time: string;
}

    // dictionary where the key is the map name and the value is an array of scores
    // has all the scores sorted descending order
interface MapScores {
    [mapName: string]: Score[];
}

var HIGH_SCORE: MapScores = {};

   // number of scores to save (just save the best ones)
var HIGH_SCORE_LENGTH = 5;


/*
    Load from local storage
 */
export function load( score: MapScores )
    {
    if ( score )
        {
            // previous high-score data was an array with the scores
            // need to migrate the data to the current structure
            // the previous high-score were all on the 'random' map type (since that was the only map available)
        if ( Array.isArray( score ) )
            {
            var randomScores = <any> score;
            HIGH_SCORE = {
                    'random': randomScores
                }

            save();
            }

        else
            {
            HIGH_SCORE = score;
            }
        }
    }


/*
    Save to local storage
 */
export function save()
    {
    AppStorage.setData({ snake_high_score: HIGH_SCORE });
    }


export function add( mapName: MapName, numberOfTails: number, time: string )
    {
        // the snake always has 1 tail, so only consider scores above that (where you actually played the game)
    if ( numberOfTails <= 1 )
        {
        return;
        }

    var scoreArray = HIGH_SCORE[ mapName ];

    if ( typeof scoreArray === 'undefined' )
        {
        scoreArray = [];
        HIGH_SCORE[ mapName ] = scoreArray;
        }

    scoreArray.push({
        numberOfTails: numberOfTails,
        difficulty: Options.getDifficultyString(),
        frame: boolToOnOff( Options.getFrame() ),
        canvasWidth: Options.getCanvasWidth(),
        canvasHeight: Options.getCanvasHeight(),
        time: time
        });

    scoreArray.sort( function(a, b)
        {
        return b.numberOfTails - a.numberOfTails;
        });

        // if we passed the limit, remove the last one (the lesser score)
    if ( scoreArray.length > HIGH_SCORE_LENGTH )
        {
        scoreArray.pop();
        }
    }


export function getMapScores( mapName: MapName )
    {
    return HIGH_SCORE[ mapName ];
    }
