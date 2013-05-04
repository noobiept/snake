
function SnakeTail( x, y )
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

STAGE.addChild( snakeTail );
STAGE.update();


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

bodyDef.position.x = x / SCALE;
bodyDef.position.y = y / SCALE;


var body = WORLD.CreateBody( bodyDef );

body.CreateFixture( fixDef );
body.SetUserData( this );


    // set the properties to the object
this.shape = snakeTail;
this.body = body;

this.width = width;
this.height = height;

return this;
}


/*
    position on the canvas
 */

SnakeTail.prototype.position = function( x, y )
{
return this.move( x, y, 0, 0 );
};


/*
    move in relation to the current position (or a position given)
 */

SnakeTail.prototype.move = function( x, y, startX, startY )
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

this.shape.x = startX + x;
this.shape.y = startY + y;

this.body.SetPosition(  new b2Vec2( this.shape.x / SCALE, this.shape.y / SCALE ) );
};




SnakeTail.prototype.getX = function()
{
return this.shape.x;
};


SnakeTail.prototype.getY = function()
{
return this.shape.y;
};