module Options
{
var DIFFICULTY = {
    normal: 0,
    hard: 1
    };

var DIFFICULTY_STRING = [ 'normal', 'hard' ];

var OPTIONS = {
    canvas_width: 800,
    canvas_height: 400,
    frameOn: false,
    difficulty: DIFFICULTY.normal
    };


export function load( options )
    {
    if ( options )
        {
        if ( $.isNumeric( options.canvas_width ) )
            {
            OPTIONS.canvas_width = options.canvas_width;
            }

        if ( $.isNumeric( options.canvas_height ) )
            {
            OPTIONS.canvas_height = options.canvas_height;
            }

        if ( typeof options.frameOn !== 'undefined' )
            {
            OPTIONS.frameOn = options.frameOn;
            }

        if ( typeof options.difficulty !== 'undefined' )
            {
            OPTIONS.difficulty = options.difficulty;
            }
        }
    }


export function save()
    {
    AppStorage.setData({ snake_options: OPTIONS });
    }


export function setDifficulty( difficulty )
    {
    OPTIONS.difficulty = difficulty;
    }


export function getDifficulty()
    {
    return OPTIONS.difficulty;
    }


export function setDifficultyString( stringValue )
    {
    Options.setDifficulty( DIFFICULTY_STRING.indexOf( stringValue ) );
    }


export function getDifficultyString()
    {
    return DIFFICULTY_STRING[ OPTIONS.difficulty ];
    }


export function setCanvasWidth( width: number )
    {
    OPTIONS.canvas_width = width;

    CANVAS.width = width;

    centerCanvas();
    }


export function getCanvasWidth()
    {
    return OPTIONS.canvas_width;
    }


export function setCanvasHeight( height: number )
    {
    OPTIONS.canvas_height = height;

    CANVAS.height = height;

    centerCanvas();
    }


export function getCanvasHeight()
    {
    return OPTIONS.canvas_height;
    }


export function setFrame( yesNo: boolean )
    {
    OPTIONS.frameOn = yesNo;
    }


export function getFrame()
    {
    return OPTIONS.frameOn;
    }
}
