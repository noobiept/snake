(function(window)
{
function Options()
{

}

var DIFFICULTY = {
    normal: 0,
    hard: 1
    };


var OPTIONS = {

    canvas_width: 800,
    canvas_height: 400,
    frameOn: false,
    difficulty: DIFFICULTY.normal

    };




var DIFFICULTY_VALUE = DIFFICULTY.normal;



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
DIFFICULTY_VALUE = difficulty;
};


Options.getDifficulty = function()
{
return DIFFICULTY_VALUE;
};


Options.setCanvasWidth = function( width )
{
OPTIONS.canvas_width = width;
};

Options.getCanvasWidth = function()
{
return OPTIONS.canvas_width;
};


Options.setCanvasHeight = function( Height )
{
OPTIONS.canvas_height = height;
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