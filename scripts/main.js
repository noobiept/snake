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

        - have special food which gives like 2 tails but increases speed momentarily as side effect
        - the high-score only shows the score for the current set of options (so that the values can be comparable)
        - improve the style of the messages/menus/game elements
        - add keyboard shortcuts in the main menu
        

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
    up: 2,
    down: 3
    };


    // in the server template, we'll change this to the static path plus the game name (otherwise any static content won't load (wrong url)). something like /static/snake/
var BASE_URL = '';


    // used to access preloaded assets (images/etc)
var PRELOAD;


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

    // preload the images/etc used in the program
PRELOAD = new createjs.LoadQueue( true );

PRELOAD.loadManifest([
    { id: 'orange', src: BASE_URL + 'images/orange_10px.png' },
    { id: 'apple', src: BASE_URL + 'images/red_apple_10px.png' }
    ]);

PRELOAD.addEventListener( 'complete', MainMenu.open );
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
var left = window.innerWidth / 2 - CANVAS.width / 2;
var top = window.innerHeight / 2 - CANVAS.height / 2;

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

var direction = snakeObject.getDirection();


if ( keysHeld.left )
    {
    if ( keysHeld.down )
        {
        if ( direction == DIR.left || direction == DIR.right )
            {
            snakeObject.changeDirection( DIR.down );
            }

        else if ( direction == DIR.down || direction == DIR.up )
            {
            snakeObject.changeDirection( DIR.left );
            }
        }

    else if ( keysHeld.up )
        {
        if ( direction == DIR.left || direction == DIR.right )
            {
            snakeObject.changeDirection( DIR.up );
            }

        else if ( direction == DIR.up || direction == DIR.down )
            {
            snakeObject.changeDirection( DIR.left );
            }
        }

    else
        {
        snakeObject.changeDirection( DIR.left );
        }
    }

else if ( keysHeld.right )
    {
    if ( keysHeld.down )
        {
        if ( direction == DIR.right || direction == DIR.left )
            {
            snakeObject.changeDirection( DIR.down );
            }

        else if ( direction == DIR.down || direction == DIR.up )
            {
            snakeObject.changeDirection( DIR.right );
            }
        }

    else if ( keysHeld.up )
        {
        if ( direction == DIR.right || direction == DIR.left )
            {
            snakeObject.changeDirection( DIR.up );
            }

        else if ( direction == DIR.up || direction == DIR.down )
            {
            snakeObject.changeDirection( DIR.right );
            }
        }

    else
        {
        snakeObject.changeDirection( DIR.right );
        }
    }

else if ( keysHeld.up )
    {
    snakeObject.changeDirection( DIR.up );
    }

else if ( keysHeld.down )
    {
    snakeObject.changeDirection( DIR.down );
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
