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


createjs.Ticker.setInterval( 50 );  // 50ms -> 20 fps
createjs.Ticker.addListener( tick );


SNAKE = new Snake( 50, 50 );

window.setInterval( function()   //HERE testing
    {
    SNAKE.addTail();
    }, 1000);
};



function tick()
{
movement_tick();

SNAKE.tick();

STAGE.update();
}
