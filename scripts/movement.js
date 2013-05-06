
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
    bottom: 3,
    top_left: 4,
    top_right: 5,
    bottom_left: 6,
    bottom_right: 7
    };

var CURRENT_DIRECTION = DIR.right;

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
if ( KEYS_HELD.left && KEYS_HELD.up )
    {
    CURRENT_DIRECTION = DIR.top_left;

    SNAKE.changeDirection( DIR.top_left );
    }

else if ( KEYS_HELD.left && KEYS_HELD.down )
    {
    CURRENT_DIRECTION = DIR.bottom_left;

    SNAKE.changeDirection( DIR.bottom_left );
    }

else if ( KEYS_HELD.right && KEYS_HELD.up )
    {
    CURRENT_DIRECTION = DIR.top_right;

    SNAKE.changeDirection( DIR.top_right );
    }

else if ( KEYS_HELD.right && KEYS_HELD.down )
    {
    CURRENT_DIRECTION = DIR.bottom_right;

    SNAKE.changeDirection( DIR.bottom_right );
    }

else if ( KEYS_HELD.left )
    {
    CURRENT_DIRECTION = DIR.left;

    SNAKE.changeDirection( DIR.left );
    }

else if ( KEYS_HELD.right )
    {
    CURRENT_DIRECTION = DIR.right;

    SNAKE.changeDirection( DIR.right );
    }

else if ( KEYS_HELD.up )
    {
    CURRENT_DIRECTION = DIR.top;

    SNAKE.changeDirection( DIR.top );
    }

else if ( KEYS_HELD.down )
    {
    CURRENT_DIRECTION = DIR.bottom;

    SNAKE.changeDirection( DIR.bottom );
    }
}


