/// <reference path="../typings/index.d.ts" />

    // createjs
var STAGE: createjs.Stage;

    // program stuff
var CANVAS: HTMLCanvasElement;

    // the elements type in the game (useful to identify objects, call .getType() )
enum ElementsType {
    tail,
    snake
}

enum Direction {
    left,
    right,
    up,
    down
}

interface Path {
    x: number;
    y: number;
    direction: Direction;
}

interface KeyboardMapping {
    left: number;
    left2?: number;
    right: number;
    right2?: number;
    up: number;
    up2?: number;
    down: number;
    down2?: number;
}

type MapName = 'random' | 'stairs' | 'lines' | 'empty';

    // used to access preloaded assets (images/etc)
var PRELOAD: createjs.LoadQueue;


window.onload = function()
{
AppStorage.getData( [ 'snake_high_score', 'snake_options', 'snake_has_run_before', 'snake_selected_map' ], initApp );
};


function initApp( data )
{
Options.load( data[ 'snake_options' ] );

    // setup the canvas
CANVAS = <HTMLCanvasElement> document.querySelector( '#mainCanvas' );
CANVAS.width = Options.getCanvasWidth();
CANVAS.height = Options.getCanvasHeight();

centerCanvas();

    // :: createjs stuff :: //
STAGE = new createjs.Stage( CANVAS );

createjs.Ticker.setInterval( 50 );
createjs.Ticker.on( 'tick', tick );

HighScore.load( data[ 'snake_high_score' ] );
MainMenu.init( data[ 'snake_selected_map' ] );
GameMenu.init();
Game.init();

    // preload the images/etc used in the program
PRELOAD = new createjs.LoadQueue( true );

PRELOAD.loadManifest([
    { id: 'orange', src: 'images/orange_10px.png' },
    { id: 'apple', src: 'images/red_apple_10px.png' }
    ]);

var callback;

    // on the first run of the program, show the help page
if ( !data[ 'snake_has_run_before' ] )
    {
    AppStorage.setData({ snake_has_run_before: true });
    callback = MainMenu.help;
    }

else
    {
    callback = MainMenu.open;
    }

PRELOAD.addEventListener( 'complete', callback );
}


window.onresize = function()
{
centerCanvas();
MainMenu.reCenter();
GameMenu.reCenterGameMenu();
};


window.onkeydown = function( event )
{
var returnValue;

for (var i = 0 ; i < Snake.ALL_SNAKES.length ; i++)
    {
    returnValue = Snake.ALL_SNAKES[ i ].onKeyDown( event.keyCode );

    if ( !returnValue )
        {
        return returnValue;
        }
    }

return true;
};


window.onkeyup = function( event )
{
var returnValue;

for (var i = 0 ; i < Snake.ALL_SNAKES.length ; i++)
    {
    returnValue = Snake.ALL_SNAKES[ i ].onKeyUp( event.keyCode );

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
        if ( direction == Direction.left || direction == Direction.right )
            {
            snakeObject.changeDirection( Direction.down );
            }

        else if ( direction == Direction.down || direction == Direction.up )
            {
            snakeObject.changeDirection( Direction.left );
            }
        }

    else if ( keysHeld.up )
        {
        if ( direction == Direction.left || direction == Direction.right )
            {
            snakeObject.changeDirection( Direction.up );
            }

        else if ( direction == Direction.up || direction == Direction.down )
            {
            snakeObject.changeDirection( Direction.left );
            }
        }

    else
        {
        snakeObject.changeDirection( Direction.left );
        }
    }

else if ( keysHeld.right )
    {
    if ( keysHeld.down )
        {
        if ( direction == Direction.right || direction == Direction.left )
            {
            snakeObject.changeDirection( Direction.down );
            }

        else if ( direction == Direction.down || direction == Direction.up )
            {
            snakeObject.changeDirection( Direction.right );
            }
        }

    else if ( keysHeld.up )
        {
        if ( direction == Direction.right || direction == Direction.left )
            {
            snakeObject.changeDirection( Direction.up );
            }

        else if ( direction == Direction.up || direction == Direction.down )
            {
            snakeObject.changeDirection( Direction.right );
            }
        }

    else
        {
        snakeObject.changeDirection( Direction.right );
        }
    }

else if ( keysHeld.up )
    {
    snakeObject.changeDirection( Direction.up );
    }

else if ( keysHeld.down )
    {
    snakeObject.changeDirection( Direction.down );
    }
}


function tick( event )
{
if ( event.paused )
    {
    return;
    }

var snakeObject;

for (var i = 0 ; i < Snake.ALL_SNAKES.length ; i++)
    {
    snakeObject = Snake.ALL_SNAKES[ i ];

    movement_tick( snakeObject );

    snakeObject.tick();
    }

Snake.checkCollision();
STAGE.update();
}
