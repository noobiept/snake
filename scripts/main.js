/*
    brief description:

        - have obstacles (walls)
        - have food (grows tail)
        - snake can't hit its own tail or the obstacles
        - snake always on constant movement (you control the direction)
        - can't reverse the snake's direction
        - the obstacles and food are generated automatically (you can choose the timings in the options)

        - options:



    to doo:

        - have the option to have a 'frame' around the window, so that you can't pass to the other side (you die if touch it)
        - appear the stuff that grows the snake tail (food, and possibly other items)
        - to win a map, maybe get to a certain score? and have free maps too, where it doesnt end
        - the speed has to be the same value has the snake's tails dimensions (width/height), so that it turns correctly
        - what to do when 2 keys being pressed (like top/right?..)
        - have highscore with number of tails (but it kind of depends on the options? the difficulty level)
        - have menu with highscore and options for snake speed, time takes to get food, obstacles..
        - have special food which gives like 2 tails but increases speed momentarily as side effect
        - the speed option have it in pixels/sec (can be calculated from the tick time and pixels it moves each tick)
        - option to set the canvas width/height
        - when game over, restart the game (fast game)
        - when there's a collision (and the game ends), show where it happened (like change the color of the tail/wall)
        - have 2 players mode (2 snakes on same map)
        - better game over message (the styling, etc)
 */


    // createjs
var STAGE;


    // program stuff
var CANVAS;

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 400;


    // the elements type in the game (useful to identify objects, call .getType() )
var ELEMENTS_TYPE = {
    tail: 0,
    snake: 1
    };



window.onload = function()
{
CANVAS = document.querySelector( '#mainCanvas' );

CANVAS.width = CANVAS_WIDTH;
CANVAS.height = CANVAS_HEIGHT;


    // :: createjs stuff :: //
STAGE = new createjs.Stage( CANVAS );


createjs.Ticker.setInterval( 100 );  // 50ms -> 20 fps
createjs.Ticker.addListener( tick );


HighScore.load();

MainMenu.init();
MainMenu.open();
};


window.onunload = function()
{
HighScore.save();
};



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




/*
    When the snake hits its tails for example
 */

function gameOver()
{
var message = new Message( 'Game Over' );

pause();

window.setTimeout( function()
    {
        //HERE distinguish the snakes (like player1, player2 ?..)
    for (var i = 0 ; i < ALL_SNAKES.length ; i++)
        {
        HighScore.add( ALL_SNAKES[ i ].getNumberOfTails() );
        }

    Game.clear();

    message.remove();
    MainMenu.open();

    resume();

    }, 2000 );
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
