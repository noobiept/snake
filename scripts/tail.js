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
    direction = snakeObject.starting_direction;
    }

    // we position after the last tail, and it depends on what direction it is going
else
    {
    var lastTail = snakeObject.getTail( numberOfTails - 1 );

    var lastDirection = lastTail.direction;


    if ( lastDirection == DIR.left )
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


    // set the properties to the object
this.shape = snakeTail;

this.width = TAIL_WIDTH;
this.height = TAIL_HEIGHT;
};


/*
    Change the shape's color to red, to signal that the tail as been hit
 */

Tail.prototype.asBeenHit = function()
{
var g = this.shape.graphics;

g.beginFill( 'red' );
g.drawRoundRect( 0, 0, TAIL_WIDTH, TAIL_HEIGHT, 2 );
};



Tail.prototype.remove = function()
{
STAGE.removeChild( this.shape );
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
var canvasWidth = Options.getCanvasWidth();
var canvasHeight = Options.getCanvasHeight();

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
    nextX = canvasWidth;
    }

else if ( nextX > canvasWidth )
    {
    nextX = 0;
    }


if ( nextY < 0 )
    {
    nextY = canvasHeight;
    }

else if ( nextY > canvasHeight )
    {
    nextY = 0;
    }

this.shape.x = nextX;
this.shape.y = nextY;
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

Tail.prototype.moveInDirection = function()
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

    // here we're only moving through 'x' or 'y', so just need 'speed'
if ( direction == DIR.left )
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