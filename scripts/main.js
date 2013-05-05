/*
    to doo:

        - have the option to have a 'frame' around the window, so that you can't pass to the other side (you die if touch it)
        - add obstacles, that are generated (keep appearing, to make it more dificult?...)
        - appear the stuff that grows the snake tail (food, and possibly other items)
        - can't hit its own tail, or the walls
        - each times it eats a piece of food, it increases the snake's tail
        - the snake is always on constant movement, and you can only change the direction of the movement
        - can't reverse the movement (otherwise you go against your tail?..)
        - to win a map, maybe get to a certain score? and have free maps too, where it doesnt end
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


var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 400;


var SNAKE;


window.onload = function()
{
CANVAS_MAIN = document.querySelector( '#mainCanvas' );
CANVAS_DEBUG = document.querySelector( '#debugCanvas' );

CANVAS_MAIN.width = CANVAS_WIDTH;
CANVAS_MAIN.height = CANVAS_HEIGHT;

CANVAS_DEBUG.width = CANVAS_WIDTH;
CANVAS_DEBUG.height = CANVAS_HEIGHT;


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
