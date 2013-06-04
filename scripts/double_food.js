(function(window)
{
function DoubleFood( x, y )
{
    // DoubleFood inherits from Food
Food.call( this, x, y );
}


    // inherit the member functions
INHERIT_PROTOTYPE( DoubleFood, Food );




DoubleFood.prototype.draw = function( x, y )
{
var width = this.width;
var height = this.height;

var food = new createjs.Bitmap( BASE_URL + 'images/orange_10px.png' );

food.regX = width / 2;
food.regY = height / 2;

food.x = x;
food.y = y;

STAGE.addChild( food );

this.shape = food;
};


DoubleFood.prototype.eat = function( snakeObject )
{
snakeObject.addTail();
snakeObject.addTail();

    //HERE and increase momentarily the snake's speed, as the disadvantage
};




window.DoubleFood = DoubleFood;

}(window));
