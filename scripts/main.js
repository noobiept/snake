/*
    brief description:

        - have obstacles (walls)
        - have food (grows tail)
        - snake can't hit its own tail or the obstacles
        - snake always on constant movement (you control the direction)
        - can't reverse the snake's direction
        - the obstacles and food are generated automatically
        - have an option to have a frame around the canvas, to prevent the snake to go to the other side
        - have an option to change the difficulty, which changes the food/wall spawning time, etc
        - have an option to change the canvas width/height


    to doo:

        - what to do when 2 keys being pressed (like top/right?..)
        - have high-score with number of tails (but it kind of depends on the options? the difficulty level)
        - have special food which gives like 2 tails but increases speed momentarily as side effect
        - have 2 players mode (2 snakes on same map)
        - the high-score only shows the score for the current set of options (so that the values can be comparable)
        - improve the style of the messages/menus/game elements

Dependencies:

    - jquery -- 2.0
    - jquery-ui -- 1.10

        - slider
        - blitzer theme

    - easeljs -- 0.6.0

 */


    // createjs
var STAGE;


    // program stuff
var CANVAS;



    // the elements type in the game (useful to identify objects, call .getType() )
var ELEMENTS_TYPE = {
    tail: 0,
    snake: 1
    };



window.onload = function()
{
Options.load();


    // setup the canvas
CANVAS = document.querySelector( '#mainCanvas' );


CANVAS.width = Options.getCanvasWidth();
CANVAS.height = Options.getCanvasHeight();

centerCanvas();


    // :: createjs stuff :: //
STAGE = new createjs.Stage( CANVAS );

var difficulty = Options.getDifficulty();

createjs.Ticker.setInterval( 50 );
createjs.Ticker.addListener( tick );


HighScore.load();

MainMenu.init();
MainMenu.open();
};


window.onunload = function()
{
HighScore.save();
Options.save();
};


/*
    center the canvas in the middle of window
 */

function centerCanvas()
{
var left = $( window ).width() / 2 - CANVAS.width / 2;
var top = $( window ).height() / 2 - CANVAS.height / 2;

$( CANVAS ).css( 'left', left + 'px' );
$( CANVAS ).css( 'top', top + 'px' );
}



/*
    Clears the canvas, resets stuff
 */

function clearCanvas()
{
MainMenu.clear();

STAGE.removeAllChildren();
}


function pause()
{
createjs.Ticker.setPaused( true );
}


function resume()
{
createjs.Ticker.setPaused( false );
}




function tick()
{
var snakeObject;

for (var i = 0 ; i < ALL_SNAKES.length ; i++)
    {
    snakeObject = ALL_SNAKES[ i ];

    movement_tick( snakeObject );

    snakeObject.tick();
    }

STAGE.update();
}
