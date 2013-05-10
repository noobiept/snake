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
 */



    // createjs
var STAGE;


    // program stuff
var CANVAS;

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 400;


var SNAKE;

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


SNAKE = new Snake( 50, 50 );


    // add food
window.setInterval( function()
    {
    var x = getRandomInt( 0, CANVAS_WIDTH );
    var y = getRandomInt( 0, CANVAS_HEIGHT );

    new Food( x, y );

    }, 1000 );


    // add walls
window.setInterval( function()
    {
    var x = getRandomInt( 0, CANVAS_WIDTH );
    var y = getRandomInt( 0, CANVAS_HEIGHT );

    var width = getRandomInt( 40, 100 );
    var height = getRandomInt( 10, 20 );

    var verticalOrientation = getRandomInt( 0, 1 );

        // switch the width/height
    if ( verticalOrientation )
        {
        var temp = width;

        width = height;
        height = temp;
        }

        // we have to make sure it doesnt add on top of the snake
        //HERE it could still be added on top of the tails?.. isn't as bad since what matters in the collision is the first tail
    var snakeX = SNAKE.getX();
    var snakeY = SNAKE.getY();

    var margin = 20;

        // means the wall position is close to the snake
    if ( snakeX > x - margin && snakeX < x + margin &&
         snakeY > y - margin && snakeY < y + margin )
        {
        x += 100;
        y += 100;

            // to make sure it doesn't go out of bounds
        x = checkOverflowPosition( x, CANVAS_WIDTH );
        y = checkOverflowPosition( y, CANVAS_HEIGHT );
        }

    new Wall( x, y, width, height );

    }, 2000 );
};



function tick()
{
movement_tick();

SNAKE.tick();

STAGE.update();
}
