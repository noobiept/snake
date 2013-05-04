/*
    to doo:

        - when goes out of the canvas appear at the other side
        - also have the option to just crash there?...
        - add obstacles, that are generated (keep appearing, to make it more dificult?...)
        - appear the stuff that grows the snake tail
 */



    // createjs
var STAGE;

    // box2d physics
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;

    // scale from meters/kilograms/seconds into pixels
var SCALE = 30;

var WORLD;


    // program stuff
var CANVAS_MAIN;
var CANVAS_DEBUG;

    // if we show the debug canvas or not
var DEBUG_MODE = true;


var GAME_WIDTH = 800;
var GAME_HEIGHT = 400;


var SNAKE;


window.onload = function()
{
CANVAS_MAIN = document.querySelector( '#mainCanvas' );
CANVAS_DEBUG = document.querySelector( '#debugCanvas' );

CANVAS_MAIN.width = GAME_WIDTH;
CANVAS_MAIN.height = GAME_HEIGHT;

CANVAS_DEBUG.width = GAME_WIDTH;
CANVAS_DEBUG.height = GAME_HEIGHT;


    // :: createjs stuff :: //
STAGE = new createjs.Stage( CANVAS_MAIN );


createjs.Ticker.addListener( tick );


    // :: box2d stuff :: //

WORLD = new b2World(
    new b2Vec2( 0, 60 ),    // gravity
    true                    // allow sleep
    );


if ( DEBUG_MODE )
    {
    $( CANVAS_DEBUG ).css( 'display', 'block' );

    var debugDraw = new b2DebugDraw();

    debugDraw.SetSprite( CANVAS_DEBUG.getContext( '2d' ) );
    debugDraw.SetDrawScale( SCALE );
    debugDraw.SetFillAlpha( 0.4 );
    debugDraw.SetLineThickness( 1 );
    debugDraw.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );

    WORLD.SetDebugDraw( debugDraw );
    }




SNAKE = new SnakeTail( 50, 50 );
};




    // keys being pressed/held
var KEYS_HELD = {

    left  : false,
    right : false,
    up    : false,
    down  : false

    };

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
var speed = 5;

    // when moving diagonally (45 degrees), we have to slow down the x and y
    // we have a triangle, and want the hypotenuse to be 'speed', with angle of 45º (pi / 4)
    // sin(angle) = opposite / hypotenuse
    // cos(angle) = adjacent / hypotenuse

    // x = cos( pi / 4 ) -> 0.707
    // y = sin( pi / 4 ) -> 0.707

if ( KEYS_HELD.left && KEYS_HELD.up )
    {
    SNAKE.move( -speed * 0.707 , -speed * 0.707 );
    }

else if ( KEYS_HELD.left && KEYS_HELD.down )
    {
    SNAKE.move( -speed * 0.707, speed * 0.707 );
    }

else if ( KEYS_HELD.right && KEYS_HELD.up )
    {
    SNAKE.move( speed * 0.707, -speed * 0.707 );
    }

else if ( KEYS_HELD.right && KEYS_HELD.down )
    {
    SNAKE.move( speed * 0.707, speed * 0.707 );
    }

    // here we're only moving through 'x' or 'y', so just need 'speed'
else if ( KEYS_HELD.left )
    {
    SNAKE.move( -speed );
    }

else if ( KEYS_HELD.right )
    {
    SNAKE.move( speed );
    }

else if ( KEYS_HELD.up )
    {
    SNAKE.move( 0, -speed );
    }

else if ( KEYS_HELD.down )
    {
    SNAKE.move( 0, speed );
    }
}


function tick()
{
movement_tick();

WORLD.Step(
    1 / 60,     // frame-rate
    10,         // velocity iterations
    10          // position iterations
    );

WORLD.DrawDebugData();
WORLD.ClearForces();

STAGE.update();
}
