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


/*
    When there's a collision between the snake and the food, the food is 'eaten' (this applies the effects of that)
 */

Food.prototype.eat = function( snakeObject )
{
snakeObject.addTail();
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


Food.removeAll = function()
{
for (var i = 0 ; i < ALL_FOOD.length ; i++)
    {
    ALL_FOOD[ i ].remove();
    i--;    // since we're messing around with the ALL_FOOD array
    }
};


window.Food = Food;
window.ALL_FOOD = ALL_FOOD;

}(window));
