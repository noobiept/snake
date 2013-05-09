
    // keys being pressed/held
var KEYS_HELD = {

    left  : false,
    right : false,
    up    : false,
    down  : false

    };


var DIR = {
    left: 0,
    right: 1,
    top: 2,
    bottom: 3
    };


    // when a game starts, the direction the snake is going
var STARTING_DIRECTION = DIR.right;


window.onkeydown = function( event )
{
if ( !event )
    {
    event = window.event;
    }

switch( event.keyCode )
    {
    case EVENT_KEY.a:
    case EVENT_KEY.leftArrow:

        KEYS_HELD.left = true;
        return false;

    case EVENT_KEY.d:
    case EVENT_KEY.rightArrow:

        KEYS_HELD.right = true;
        return false;

    case EVENT_KEY.w:
    case EVENT_KEY.upArrow:

        KEYS_HELD.up = true;
        return false;

    case EVENT_KEY.s:
    case EVENT_KEY.downArrow:

        KEYS_HELD.down = true;
        return false;
    }

return true;
};


window.onkeyup = function( event )
{
if ( !event )
    {
    event = window.event;
    }

switch( event.keyCode )
    {
    case EVENT_KEY.a:
    case EVENT_KEY.leftArrow:

        KEYS_HELD.left = false;
        return false;

    case EVENT_KEY.d:
    case EVENT_KEY.rightArrow:

        KEYS_HELD.right = false;
        return false;

    case EVENT_KEY.w:
    case EVENT_KEY.upArrow:

        KEYS_HELD.up = false;
        return false;

    case EVENT_KEY.s:
    case EVENT_KEY.downArrow:

        KEYS_HELD.down = false;
        return false;
    }

return true;
};





function movement_tick()
{
if ( KEYS_HELD.left )
    {
    SNAKE.changeDirection( DIR.left );
    }

else if ( KEYS_HELD.right )
    {
    SNAKE.changeDirection( DIR.right );
    }

else if ( KEYS_HELD.up )
    {
    SNAKE.changeDirection( DIR.top );
    }

else if ( KEYS_HELD.down )
    {
    SNAKE.changeDirection( DIR.bottom );
    }
}


