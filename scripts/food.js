(function(window)
{
var ALL_FOOD = [];

function Food( x, y )
{
this.width = 10;
this.height = 10;


this.draw( x, y );

ALL_FOOD.push( this );
}


Food.prototype.draw = function( x, y )
{
var width = this.width;
var height = this.height;

var food = new createjs.Shape();

food.regX = width / 2;
food.regY = height / 2;

food.x = x;
food.y = y;


var g = food.graphics;

g.beginFill( 'red' );
g.drawRoundRect( 0, 0, width, height, 10 );

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


Food.prototype.getWidth = function()
{
return this.width;
};


Food.prototype.getHeight = function()
{
return this.height;
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
