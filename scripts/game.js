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


    // in milliseconds
    // the order is according to the difficulty (so on normal mode, we get the first element, so 50ms)
var TIME_BETWEEN_TICKS = [ 50, 30 ];


var TIMER;

Game.start = function()
{
clearCanvas();


var difficulty = Options.getDifficulty();
var canvasWidth = Options.getCanvasWidth();
var canvasHeight = Options.getCanvasHeight();


var snakeObject = new Snake( 50, 50 );


createjs.Ticker.setInterval( TIME_BETWEEN_TICKS[ difficulty ] );

    // add a wall around the canvas (so that you can't pass through from one side to the other)
if ( Options.getFrame() )
    {
    new Wall( 0, canvasHeight / 2, 5, canvasHeight ); // left
    new Wall( canvasWidth / 2, 0, canvasWidth, 5 );   // top
    new Wall( canvasWidth, canvasHeight / 2, 5, canvasHeight ); // right
    new Wall( canvasWidth / 2, canvasHeight, canvasWidth, 5 ); //bottom
    }



    // check if a food/wall position is colliding with any of the  walls/foods
var check = function( x, y, width, height, elementsArray )
    {
    for (var i = 0 ; i < elementsArray.length ; i++)
        {
        var element = elementsArray[ i ];

        if ( checkCollision( x, y, width, height, element.getX(), element.getY(), element.getWidth(), element.getHeight() ) )
            {
            return true;
            }
        }

    return false;
    };




    // add food
var interval = window.setInterval( function()
    {
    var x, y;

        // don't add food on top of the walls (otherwise its impossible to get it)
        // try 5 times, otherwise just use whatever position
    for (var i = 0 ; i < 5 ; i++)
        {
        x = getRandomInt( 0, canvasWidth );
        y = getRandomInt( 0, canvasHeight );

        if ( !check( x, y, FOOD_WIDTH, FOOD_HEIGHT, ALL_WALLS ) )
            {
            break;
            }
        }

    new Food( x, y );

    }, FOOD_TIMINGS[ difficulty ] );


    // saving a reference to this, so that we can stop this later
INTERVALS.push( interval );


    // add double food
interval = window.setInterval( function()
    {
    var x, y;

        // don't add food on top of the walls (otherwise its impossible to get it)
        // try 5 times, otherwise just use whatever position
    for (var i = 0 ; i < 5 ; i++)
        {
        x = getRandomInt( 0, canvasWidth );
        y = getRandomInt( 0, canvasHeight );

        if ( !check( x, y, FOOD_WIDTH, FOOD_HEIGHT, ALL_WALLS ) )
            {
            break;
            }
        }

    new DoubleFood( x, y );

    }, DOUBLE_FOOD_TIMINGS[ difficulty ] );


INTERVALS.push( interval );


    // add walls
interval = window.setInterval( function()
    {
    var x, y, width, height, verticalOrientation;

        // don't add walls on top of the food (otherwise its impossible to get it)
        // try 5 times, otherwise just use whatever position
    for (var i = 0 ; i < 5 ; i++)
        {
        x = getRandomInt( 0, canvasWidth );
        y = getRandomInt( 0, canvasHeight );

        width = getRandomInt( 40, 100 );
        height = getRandomInt( 10, 20 );

        verticalOrientation = getRandomInt( 0, 1 );

            // switch the width/height
        if ( verticalOrientation )
            {
            var temp = width;

            width = height;
            height = temp;
            }

        if ( !check( x, y, width, height, ALL_FOOD ) )
            {
            break;
            }
        }


        // we have to make sure it doesnt add on top of the snake
        //HERE it could still be added on top of the tails?.. isn't as bad since what matters in the collision is the first tail
        // also we could add the wall on top of food (since we're changing the values we checked above)
    var snakeX = snakeObject.getX();
    var snakeY = snakeObject.getY();

    var margin = 40;

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

Game.initMenu();
};


Game.initMenu = function()
{
var gameMenu = document.querySelector( '#GameMenu' );

var quit = gameMenu.querySelector( '#GameMenu-quit' );

quit.onclick = function()
    {
    Game.clear();

    MainMenu.open();
    };


var timer = gameMenu.querySelector( '#GameMenu-timer' );


TIMER = new Timer( timer );


    // position the menu on the bottom right of the canvas
var canvasPosition = $( CANVAS ).position();

var left = canvasPosition.left + Options.getCanvasWidth() - $( gameMenu ).width();
var top = canvasPosition.top + Options.getCanvasHeight();

$( gameMenu ).css( 'top', top + 'px' );
$( gameMenu ).css( 'left', left + 'px' );


$( gameMenu ).css( 'display', 'block' );
};


/*
    When the snake hits its tails for example
 */

Game.over = function()
{
var message = new Message({
    text: 'Game Over',
    cssClass: 'Message-gameOver'
    });


TIMER.stop();

pause();

    // prevent from clicking on the game menu, while the interval is set
var quit = document.querySelector( '#GameMenu-quit' );

quit.onclick = null;

window.setTimeout( function()
    {
        //HERE distinguish the snakes (like player1, player2 ?..)
        // the high-score would be only added to the player who won?..
    for (var i = 0 ; i < ALL_SNAKES.length ; i++)
        {
        HighScore.add( ALL_SNAKES[ i ].getNumberOfTails(), TIMER.getString() );
        }

    Game.clear();

    message.remove();
    MainMenu.open();

    resume();

    }, 2000 );
};


Game.clear = function()
{
for (var i = 0 ; i < INTERVALS.length ; i++)
    {
    window.clearInterval( INTERVALS[ i ] );
    }

INTERVALS.length = 0;

TIMER.stop();

Snake.removeAll();
Wall.removeAll();
Food.removeAll();

$( '#GameMenu' ).css( 'display', 'none' );

clearCanvas();
};


window.Game = Game;

}(window));