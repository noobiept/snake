module HighScore
{
interface Score {
    numberOfTails: number;
    difficulty: string;
    frame: string;
    canvasWidth: number;
    canvasHeight: number;
    time: string;
}

    // has all the scores sorted descending order
var HIGH_SCORE: Score[] = [];

   // number of scores to save (just save the best ones)
var HIGH_SCORE_LENGTH = 5;


/*
    Load from local storage
 */
export function load( score: Score[] )
    {
    if ( score )
        {
        HIGH_SCORE = score;
        }
    }


/*
    Save to local storage
 */
export function save()
    {
    AppStorage.setData({ snake_high_score: HIGH_SCORE });
    }


export function add( numberOfTails: number, time: string )
    {
    HIGH_SCORE.push({
        numberOfTails: numberOfTails,
        difficulty: Options.getDifficultyString(),
        frame: boolToOnOff( Options.getFrame() ),
        canvasWidth: Options.getCanvasWidth(),
        canvasHeight: Options.getCanvasHeight(),
        time: time
        });

    HIGH_SCORE.sort( function(a, b)
        {
        return b.numberOfTails - a.numberOfTails;
        });

        // if we passed the limit, remove the last one (the lesser score)
    if ( HIGH_SCORE.length > HIGH_SCORE_LENGTH )
        {
        HIGH_SCORE.pop();
        }
    }


export function getAll()
    {
    return HIGH_SCORE;
    }


export function get( position: number )
    {
    if ( position < 0 || position >= HIGH_SCORE.length )
        {
        return null;
        }

    return HIGH_SCORE[ position ];
    }
}
