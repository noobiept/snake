(function(window)
{
var ALL_WALLS = [];


/*

 */

function Wall( x, y, width, height )
{
this.width = width;
this.height = height;

this.draw( x, y, width, height );

ALL_WALLS.push( this );
}


Wall.prototype.draw = function( x, y, width, height )
{
var wall = new createjs.Shape();

wall.regX = width / 2;
wall.regY = height / 2;

wall.x = x;
wall.y = y;

var g = wall.graphics;

g.beginFill( 'white' );
g.drawRoundRect( 0, 0, width, height, 2 );

STAGE.addChild( wall );

this.shape = wall;
};


Wall.prototype.getX = function()
{
return this.shape.x;
};


Wall.prototype.getY = function()
{
return this.shape.y;
};


Wall.prototype.getWidth = function()
{
return this.width;
};


Wall.prototype.getHeight = function()
{
return this.height;
};


Wall.prototype.remove = function()
{
var position = ALL_WALLS.indexOf( this );

ALL_WALLS.splice( position, 1 );

STAGE.removeChild( this.shape );
};


window.Wall = Wall;
window.ALL_WALLS = ALL_WALLS;

}(window));