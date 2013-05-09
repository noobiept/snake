(function(window)
{
var ALL_FOOD = [];

function Food( x, y )
{
this.radius = 5;


this.draw( x, y );

ALL_FOOD.push( this );
}


Food.prototype.draw = function( x, y )
{
var radius = this.radius;

var food = new createjs.Shape();

food.regX = radius;
food.regY = radius;

food.x = x;
food.y = y;


var g = food.graphics;

g.beginFill( 'red' );
g.drawCircle( 0, 0, radius );

STAGE.addChild( food );

this.shape = food;
};


Food.prototype.getX = function()
{
return this.shape.x;
};


Food.prototype.getY = function()
{
return this.shape.y;
};


Food.prototype.getRadius = function()
{
return this.radius;
};


Food.prototype.remove = function()
{
var position = ALL_FOOD.indexOf( this );

ALL_FOOD.splice( position, 1 );

STAGE.removeChild( this.shape );
};


window.Food = Food;
window.ALL_FOOD = ALL_FOOD;

}(window));