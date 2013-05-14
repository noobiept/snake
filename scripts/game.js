(function(window)
{
function Game()
{

}

var INTERVALS = [];

    // the time until we add a new food/wall/etc
    // depends on the difficulty level
    // the order matters (get the difficulty from Options, which will be the position in this)
var FOOD_TIMINGS = [ 1000, 3000 ];
var DOUBLE_FOOD_TIMINGS = [ 5000, 10000 ];
var WALL_TIMINGS = [ 4000, 2000 ];



Game.start = function()
{
clearCanvas();


var difficulty = Options.getDifficulty();
var canvasWidth = Options.getCanvasWidth();
var canvasHeight = Options.getCanvasHeight();


var snakeObject = new Snake( 50, 50 );


    // add a wall around the canvas (so that you can't pass through from one side to the other)
if ( Options.getFrame() )
    {
    new Wall( 0, canvasHeight / 2, 5, canvasHeight ); // left
    new Wall( canvasWidth / 2, 0, canvasWidth, 5 );   // top
    new Wall( canvasWidth, canvasHeight / 2, 5, canvasHeight ); // right
    new Wall( canvasWidth / 2, canvasHeight, canvasWidth, 5 ); //bottom
    }



    // add food
var interval = window.setInterval( function()
    {
    var x = getRandomInt( 0, canvasWidth );
    var y = getRandomInt( 0, canvasHeight );

    new Food( x, y );

    }, FOOD_TIMINGS[ difficulty ] );


    // saving a reference to this, so that we can stop this later
INTERVALS.push( interval );


    // add double food
interval = window.setInterval( function()
    {
    var x = getRandomInt( 0, canvasWidth );
    var y = getRandomInt( 0, canvasHeight );

    new DoubleFood( x, y );

    }, DOUBLE_FOOD_TIMINGS[ difficulty ] );


INTERVALS.push( interval );


    // add walls
interval = window.setInterval( function()
    {
    var x = getRandomInt( 0, canvasWidth );
    var y = getRandomInt( 0, canvasHeight );

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
    var snakeX = snakeObject.getX();
    var snakeY = snakeObject.getY();

    var margin = 20;

        // means the wall position is close to the snake
    if ( snakeX > x - margin && snakeX < x + margin &&
         snakeY > y - margin && snakeY < y + margin )
        {
        x += 100;
        y += 100;

            // to make sure it doesn't go out of bounds
        x = checkOverflowPosition( x, canvasWidth );
        y = checkOverflowPosition( y, canvasHeight );
        }

    new Wall( x, y, width, height );

    }, WALL_TIMINGS[ difficulty ] );


INTERVALS.push( interval );
};


Game.clear = function()
{
for (var i = 0 ; i < INTERVALS.length ; i++)
    {
    window.clearInterval( INTERVALS[ i ] );
    }

INTERVALS.length = 0;

Snake.removeAll();
Wall.removeAll();
Food.removeAll();

clearCanvas();
};


window.Game = Game;

}(window));