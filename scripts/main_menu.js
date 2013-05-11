(function(window)
{
function MainMenu()
{

}


MainMenu.open = function()
{
clearCanvas();

var container = document.querySelector( '#MainMenu' );

var startGame = container.querySelector( '#MainMenu-startGame' );
var options = container.querySelector( '#MainMenu-options' );
var highscore = container.querySelector( '#MainMenu-highscore' );


startGame.onclick = function()
    {
    MainMenu.startGame();
    };


options.onclick = function()
    {
    MainMenu.options();
    };


highscore.onclick = function()
    {
    MainMenu.highscore();
    };


$( container ).css( 'display', 'block' );
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


MainMenu.highscore = function()
{
clearCanvas();

};



window.MainMenu = MainMenu;

}(window));