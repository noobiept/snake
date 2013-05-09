(function(window)
{
var TAIL_WIDTH = 10;    // width and height need to be the same value
var TAIL_HEIGHT = TAIL_WIDTH;


function Tail( snakeObject )
{
this.snakeObject = snakeObject;


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


this.type = ELEMENTS_TYPE.tail;
this.path = path;
this.direction = direction;


    // it automatically calls the method .tick()
createjs.Ticker.addListener( this );
}



Tail.prototype.draw = function( x, y )
{
    // createjs
var snakeTail = new createjs.Shape();

snakeTail.regX = TAIL_WIDTH / 2;
snakeTail.regY = TAIL_HEIGHT / 2;

snakeTail.x = x;
snakeTail.y = y;

var g = snakeTail.graphics;


g.beginFill( 'green' );
g.drawRoundRect( 0, 0, TAIL_WIDTH, TAIL_HEIGHT, 2 );

STAGE.addChild( snakeTail );


    // box2d physics

var fixDef = new b2FixtureDef;

fixDef.density = 1;
fixDef.friction = 0.5;
fixDef.restitution = 0;     // 'bounciness'
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox( TAIL_WIDTH / 2 / SCALE, TAIL_HEIGHT / 2 / SCALE );

var bodyDef = new b2BodyDef;

//bodyDef.type = b2Body.b2_staticBody;
bodyDef.type = b2Body.b2_dynamicBody;

    // we need to add the container's position, since the 'x' 'y' is relative to the container (in the createjs Shape() above is not needed, since we're adding to the container, so its already relative)
bodyDef.position.x = x / SCALE;
bodyDef.position.y = y / SCALE;


var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );
body.SetUserData( this );


    // set the properties to the object
this.shape = snakeTail;
this.body = body;

this.width = TAIL_WIDTH;
this.height = TAIL_HEIGHT;
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


this.body.SetPosition(  new b2Vec2( nextX / SCALE, nextY / SCALE ) );
};




Tail.prototype.getX = function()
{
return this.shape.x;
};


Tail.prototype.getY = function()
{
return this.shape.y;
};


Tail.prototype.getWidth = function()
{
return this.width;
};


Tail.prototype.getHeight = function()
{
return this.height;
};


Tail.prototype.getType = function()
{
return this.type;
};


/*
    Move in the current direction
 */

Tail.prototype.moveInDirection = function( changedDirection )
{
    // the speed has to be the same value as the width/height so that when turning the tails, they don't overlap
var speed = TAIL_WIDTH;
var direction = this.direction;

    // when moving diagonally (45 degrees), we have to slow down the x and y
    // we have a triangle, and want the hypotenuse to be 'speed', with angle of 45º (pi / 4)
    // sin(angle) = opposite / hypotenuse
    // cos(angle) = adjacent / hypotenuse

    // x = cos( pi / 4 ) -> 0.707
    // y = sin( pi / 4 ) -> 0.707

if ( direction == DIR.top_left )
    {
    this.move( -speed * 0.707 , -speed * 0.707 );

    if ( changedDirection === true )
        {
        this.shape.rotation = 135;
        this.body.SetAngle( 135 * Math.PI / 180 );
        }
    }

else if ( direction == DIR.bottom_left )
    {
    this.move( -speed * 0.707, speed * 0.707 );

    if ( changedDirection === true )
        {
        this.shape.rotation = 225;
        this.body.SetAngle( 225 * Math.PI / 180 );
        }
    }

else if ( direction == DIR.top_right )
    {
    this.move( speed * 0.707, -speed * 0.707 );

    if ( changedDirection === true )
        {
        this.shape.rotation = 45;
        this.body.SetAngle( 45 * Math.PI / 180 );
        }
    }

else if ( direction == DIR.bottom_right )
    {
    this.move( speed * 0.707, speed * 0.707 );

    if ( changedDirection === true )
        {
        this.shape.rotation = 315;
        this.body.SetAngle( 315 * Math.PI / 180 );
        }
    }

    // here we're only moving through 'x' or 'y', so just need 'speed'
else if ( direction == DIR.left )
    {
    this.move( -speed );

    if ( changedDirection === true )
        {
        this.shape.rotation = 180;
        this.body.SetAngle( 180 * Math.PI / 180 );
        }
    }

else if ( direction == DIR.right )
    {
    this.move( speed );

    if ( changedDirection === true )
        {
        this.shape.rotation = 0;
        this.body.SetAngle( 0 );
        }
    }

else if ( direction == DIR.top )
    {
    this.move( 0, -speed );

    if ( changedDirection === true )
        {
        this.shape.rotation = 90;
        this.body.SetAngle( 90 * Math.PI / 180 );
        }
    }

else if ( direction == DIR.bottom )
    {
    this.move( 0, speed );

    if ( changedDirection === true )
        {
        this.shape.rotation = 270;
        this.body.SetAngle( 270 * Math.PI / 180 );
        }
    }
};



Tail.prototype.tick = function()
{
    // have to check if this tail needs to change direction or not
var direction = this.direction;
var changedDirection = false;


if ( this.path.length !== 0 )
    {
    var checkpoint = this.path[ 0 ];

    var checkX = checkpoint.x;
    var checkY = checkpoint.y;

    var x = this.getX();
    var y = this.getY();

            // check if its on the right position
    if ( isNextTo( x, y, checkX, checkY, 2 ) )  // the range has to be less than the tail's speed
        {
            // new direction
        direction = checkpoint.direction;

        this.direction = direction;

            // remove the path checkpoint
        this.path.splice( 0, 1 );

        changedDirection = true;
        }
    }

this.moveInDirection( changedDirection );
};



window.Tail = Tail;

}(window));