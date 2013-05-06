(function(window)
{
var TAIL_WIDTH = 10;
var TAIL_HEIGHT = 10;


function Tail( snakeObject )
{
this.snakeObject = snakeObject;

    // calculate where to position the tail
var container = snakeObject.container;

var numberOfTails = snakeObject.getNumberOfTails();

var x, y;
var path = [];
var direction;

    // first tail being added, add at the same position as the container (the x/y of the tail is relative to the snake)
if ( numberOfTails == 0 )
    {
    x = 0;
    y = 0;
    direction = STARTING_DIRECTION;
    }

    // we position after the last tail, and it depends on what direction it is going
else
    {
    var lastTail = snakeObject.getTail( numberOfTails - 1 );

    var lastDirection = lastTail.direction;


    if ( lastDirection == DIR.top_left )    //HERE hmm would need to rotate the tails....
        {
        x = lastTail.getX() + TAIL_WIDTH * 0.707;
        y = lastTail.getY() + TAIL_HEIGHT * 0.707;
        }

    else if ( lastDirection == DIR.bottom_left )
        {
        x = lastTail.getX() + TAIL_WIDTH * 0.707;
        y = lastTail.getY() - TAIL_HEIGHT * 0.707;
        }

    else if ( lastDirection == DIR.top_right )
        {
        x = lastTail.getX() - TAIL_WIDTH * 0.707;
        y = lastTail.getY() + TAIL_HEIGHT * 0.707;
        }

    else if ( lastDirection == DIR.bottom_right )
        {
        x = lastTail.getX() - TAIL_WIDTH * 0.707;
        y = lastTail.getY() - TAIL_HEIGHT * 0.707;
        }

    else if ( lastDirection == DIR.left )
        {
        x = lastTail.getX() + TAIL_WIDTH;
        y = lastTail.getY();
        }

    else if ( lastDirection == DIR.right )
        {
        x = lastTail.getX() - TAIL_WIDTH;
        y = lastTail.getY();
        }

    else if ( lastDirection == DIR.top )
        {
        x = lastTail.getX();
        y = lastTail.getY() + TAIL_HEIGHT;
        }

    else if ( lastDirection == DIR.bottom )
        {
        x = lastTail.getX();
        y = lastTail.getY() - TAIL_HEIGHT;
        }



        // this tail continues the same path as the previous last one
        // using JSON here to do a copy of the array of objects (we can't just copy the references for the object)
    var pathJson = JSON.stringify( lastTail.path );
    path = JSON.parse( pathJson );

    direction = lastTail.direction;
    }

    // draw it, and setup the physics body
this.draw( x, y );


this.path = path;
this.direction = direction;


    // it automatically calls the method .tick()
createjs.Ticker.addListener( this );
}



Tail.prototype.draw = function( x, y )
{
    // createjs
var snakeTail = new createjs.Shape();

snakeTail.x = x;
snakeTail.y = y;

var g = snakeTail.graphics;

var width = 10;
var height = 10;

g.beginFill( 'green' );
g.drawRoundRect( 0, 0, width, height, 2 );


var container = this.snakeObject.container;
container.addChild( snakeTail );


    // box2d physics

var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0;     // 'bounciness'
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsOrientedBox(
    width / 2 / SCALE,      // half-width
    height / 2 / SCALE,     // half-height
    new b2Vec2( width / 2 / SCALE, height / 2 / SCALE ) // origin of center
    );

var bodyDef = new b2BodyDef;

bodyDef.type = b2Body.b2_staticBody;

    // we need to add the container's position, since the 'x' 'y' is relative to the container (in the createjs Shape() above is not needed, since we're adding to the container, so its already relative)
bodyDef.position.x = (container.x + x) / SCALE;
bodyDef.position.y = (container.y + y) / SCALE;


var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );
body.SetUserData( this );


    // set the properties to the object
this.shape = snakeTail;
this.body = body;

this.width = width;
this.height = height;
};




/*
    position on the canvas
 */

Tail.prototype.position = function( x, y )
{
return this.move( x, y, 0, 0 );
};


/*
    move in relation to the current position (or a position given)
 */

Tail.prototype.move = function( x, y, startX, startY )
{
if ( typeof x == 'undefined' )
    {
    x = 0;
    }

if ( typeof y == 'undefined' )
    {
    y = 0;
    }

if ( typeof startX == 'undefined' )
    {
    startX = this.getX();
    }

if ( typeof startY == 'undefined' )
    {
    startY = this.getY();
    }


var nextX = startX + x;
var nextY = startY + y;

    // see if outside of canvas (if so, move to the other side)
if ( nextX < 0 )
    {
    nextX = CANVAS_WIDTH;
    }

else if ( nextX > CANVAS_WIDTH )
    {
    nextX = 0;
    }


if ( nextY < 0 )
    {
    nextY = CANVAS_HEIGHT;
    }

else if ( nextY > CANVAS_HEIGHT )
    {
    nextY = 0;
    }

this.shape.x = nextX;
this.shape.y = nextY;

var container = this.snakeObject.container;

this.body.SetPosition(  new b2Vec2( (container.x + nextX) / SCALE, (container.y + nextY) / SCALE ) );
};




Tail.prototype.getX = function()
{
return this.shape.x;
};


Tail.prototype.getY = function()
{
return this.shape.y;
};


Tail.prototype.tick = function()
{
var direction = this.direction;
var speed = 5;

    // when moving diagonally (45 degrees), we have to slow down the x and y
    // we have a triangle, and want the hypotenuse to be 'speed', with angle of 45º (pi / 4)
    // sin(angle) = opposite / hypotenuse
    // cos(angle) = adjacent / hypotenuse

    // x = cos( pi / 4 ) -> 0.707
    // y = sin( pi / 4 ) -> 0.707

if ( direction == DIR.top_left )
    {
    this.move( -speed * 0.707 , -speed * 0.707 );
    }

else if ( direction == DIR.bottom_left )
    {
    this.move( -speed * 0.707, speed * 0.707 );
    }

else if ( direction == DIR.top_right )
    {
    this.move( speed * 0.707, -speed * 0.707 );
    }

else if ( direction == DIR.bottom_right )
    {
    this.move( speed * 0.707, speed * 0.707 );
    }

    // here we're only moving through 'x' or 'y', so just need 'speed'
else if ( direction == DIR.left )
    {
    this.move( -speed );
    }

else if ( direction == DIR.right )
    {
    this.move( speed );
    }

else if ( direction == DIR.top )
    {
    this.move( 0, -speed );
    }

else if ( direction == DIR.bottom )
    {
    this.move( 0, speed );
    }
};



window.Tail = Tail;

}(window));