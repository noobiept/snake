(function(window)
{
function Options()
{

}

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



Options.load = function()
{
var options = localStorage.getObject( 'options' );

if ( options !== null )
    {
    OPTIONS = options;
    }
};



Options.save = function()
{
localStorage.setObject( 'options', OPTIONS );
};


Options.setDifficulty = function( difficulty )
{
OPTIONS.difficulty = difficulty;
};


Options.getDifficulty = function()
{
return OPTIONS.difficulty;
};



Options.setDifficultyString = function( stringValue )
{
Options.setDifficulty( DIFFICULTY_STRING.indexOf( stringValue ) );
};



Options.getDifficultyString = function()
{
return DIFFICULTY_STRING[ OPTIONS.difficulty ];
};


Options.setCanvasWidth = function( width )
{
OPTIONS.canvas_width = width;

CANVAS.width = width;

centerCanvas();
};

Options.getCanvasWidth = function()
{
return OPTIONS.canvas_width;
};


Options.setCanvasHeight = function( height )
{
OPTIONS.canvas_height = height;

CANVAS.height = height;

centerCanvas();
};

Options.getCanvasHeight = function()
{
return OPTIONS.canvas_height;
};



Options.setFrame = function( yesNo )
{
OPTIONS.frameOn = yesNo;
};


Options.getFrame = function()
{
return OPTIONS.frameOn;
};




window.Options = Options;


}(window));