(function(window)
{
function Game()
{

}

var INTERVALS = [];


Game.start = function()
{
clearCanvas();


var snakeObject = new Snake( 50, 50 );


    // add food
var interval = window.setInterval( function()
    {
    var x = getRandomInt( 0, CANVAS_WIDTH );
    var y = getRandomInt( 0, CANVAS_HEIGHT );

    new Food( x, y );

    }, 1000 );


    // saving a reference to this, so that we can stop this later
INTERVALS.push( interval );


    // add double food
interval = window.setInterval( function()
    {
    var x = getRandomInt( 0, CANVAS_WIDTH );
    var y = getRandomInt( 0, CANVAS_HEIGHT );

    new DoubleFood( x, y );

    }, 2000 );


INTERVALS.push( interval );


    // add walls
interval = window.setInterval( function()
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
        x = checkOverflowPosition( x, CANVAS_WIDTH );
        y = checkOverflowPosition( y, CANVAS_HEIGHT );
        }

    new Wall( x, y, width, height );

    }, 2000 );


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