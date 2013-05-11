/*
    to doo:

        - have the option to have a 'frame' around the window, so that you can't pass to the other side (you die if touch it)
        - add obstacles, that are generated (keep appearing, to make it more dificult?...)
        - appear the stuff that grows the snake tail (food, and possibly other items)
        - can't hit its own tail, or the walls
        - each times it eats a piece of food, it increases the snake's tail
        - the snake is always on constant movement, and you can only change the direction of the movement
        - can't reverse the movement (otherwise you go against your tail?..)
        - to win a map, maybe get to a certain score? and have free maps too, where it doesnt end
        - the speed has to be the same value has the snake's tails dimensions (width/height), so that it turns correctly
        - what to do when 2 keys being pressed (like top/right?..)
        - the collision with the food is not aligned with the food's shape
        - have highscore with number of tails
        - have menu with highscore and options for snake speed, time takes to get food, obstacles..
        - have special food which gives like 2 tails but increases speed momentarely as side effect
        - the speed option have it in pixels/sec (can be calculated from the tick time and pixels it moves each tick)
        - option to set the canvas width/height
        - when game over, restart the game (fast game)
        - when there's a collision (and the game ends), show where it happened (like change the color of the tail/wall)
        - have 2 players mode (2 snakes on same map)
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

MainMenu.open();
};



/*
    Clears the canvas, resets stuff
 */

function clearCanvas()
{
$( '#MainMenu' ).css( 'display', 'none' );
$( '#Options' ).css( 'display', 'none' );
$( '#Highscore' ).css( 'display', 'none' );

STAGE.removeAllChildren();
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
