(function(window)
{
function MainMenu()
{

}

var MAIN_MENU;
var OPTIONS;
var HIGH_SCORE;

MainMenu.init = function()
{
MAIN_MENU = document.querySelector( '#MainMenu' );
OPTIONS = document.querySelector( '#Options' );
HIGH_SCORE = document.querySelector( '#HighScore' );
};


MainMenu.open = function()
{
clearCanvas();



var startGame = MAIN_MENU.querySelector( '#MainMenu-startGame' );
var options = MAIN_MENU.querySelector( '#MainMenu-options' );
var highScore = MAIN_MENU.querySelector( '#MainMenu-highScore' );


startGame.onclick = function()
    {
    MainMenu.startGame();
    };


options.onclick = function()
    {
    MainMenu.options();
    };


highScore.onclick = function()
    {
    MainMenu.highScore();
    };


$( MAIN_MENU ).css( 'display', 'block' );
MainMenu.centerMenu( MAIN_MENU );
};



MainMenu.startGame = function()
{
clearCanvas();


var snakeObject = new Snake( 50, 50 );


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
};


MainMenu.options = function()
{
clearCanvas();

};


MainMenu.highScore = function()
{
clearCanvas();

};



MainMenu.centerMenu = function( element )
{
    // the canvas may not be starting at 0,0 position, so we need to account for that
var canvasPosition = $( CANVAS ).position();

var left = CANVAS_WIDTH / 2 - $( element ).width() / 2 + canvasPosition.left;

var top = CANVAS_HEIGHT / 2 - $( element ).height() / 2 + canvasPosition.top;

$( element ).css({
    top  : top  + 'px',
    left : left + 'px'
    });
};


MainMenu.clear = function()
{
$( MAIN_MENU  ).css( 'display', 'none' );
$( OPTIONS    ).css( 'display', 'none' );
$( HIGH_SCORE ).css( 'display', 'none' );
};



window.MainMenu = MainMenu;

}(window));