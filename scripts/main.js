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
        - have special food which gives like 2 tails but increases speed momentarily as side effect
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


var DIR = {
    left: 0,
    right: 1,
    top: 2,
    bottom: 3
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





window.onkeydown = function( event )
{
if ( !event )
    {
    event = window.event;
    }


var returnValue;

for (var i = 0 ; i < ALL_SNAKES.length ; i++)
    {
    returnValue = ALL_SNAKES[ i ].onKeyDown( event.keyCode );

    if ( !returnValue )
        {
        return returnValue;
        }
    }


return true;
};


window.onkeyup = function( event )
{
if ( !event )
    {
    event = window.event;
    }


var returnValue;

for (var i = 0 ; i < ALL_SNAKES.length ; i++)
    {
    returnValue = ALL_SNAKES[ i ].onKeyUp( event.keyCode );

    if ( !returnValue )
        {
        return returnValue;
        }
    }

return true;
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




function movement_tick( snakeObject )
{
var keysHeld = snakeObject.keys_held;

if ( keysHeld.left )
    {
    snakeObject.changeDirection( DIR.left );
    }

else if ( keysHeld.right )
    {
    snakeObject.changeDirection( DIR.right );
    }

else if ( keysHeld.up )
    {
    snakeObject.changeDirection( DIR.top );
    }

else if ( keysHeld.down )
    {
    snakeObject.changeDirection( DIR.bottom );
    }
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


Snake.checkCollision();


STAGE.update();
}
