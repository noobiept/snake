(function(window)
{
function Snake( x, y )
{
this.all_tails = [];


    // add a starting tail
this.first_tail = this.addTail();

this.first_tail.position( x, y );
this.first_tail.type = ELEMENTS_TYPE.snake; // the first tail represents the head of the snake, so it has a different type
}


/*
    Add a new tail at the end
 */

Snake.prototype.addTail = function()
{
var tail = new Tail( this );

this.all_tails.push( tail );

return tail;
};



/*
    Return the position of the first tail (so, of the snake)
 */

Snake.prototype.getX = function()
{
return this.first_tail.getX();
};


Snake.prototype.getY = function()
{
return this.first_tail.getY();
};




/*
    newDirection (of the DIR variable)
 */

Snake.prototype.changeDirection = function( newDirection )
{
if ( this.getDirection() == newDirection )
    {
    return;
    }

var x = this.getX();
var y = this.getY();

var numberOfTails = this.all_tails.length;
var tail;



for (var i = 0 ; i < numberOfTails ; i++)
    {
    tail = this.all_tails[ i ];

    tail.path.push(
        {
            x: x,
            y: y,
            direction: newDirection
        });
    }
};



Snake.prototype.getNumberOfTails = function()
{
return this.all_tails.length;
};


Snake.prototype.getTail = function( position )
{
if ( position < 0 || position >= this.all_tails.length )
    {
    return null;
    }

return this.all_tails[ position ];
};



Snake.prototype.getDirection = function()
{
return this.first_tail.direction;
};




Snake.prototype.tick = function()
{
var firstTail = this.first_tail;

var firstX = firstTail.getX();
var firstY = firstTail.getY();
var firstWidth = firstTail.getWidth() / 2;
var firstHeight = firstTail.getHeight() / 2;

var tail;

    // deal with the collision detection
    // 'i' starts at 1, to not check the first tail (that's the one we're comparing with)
for (var i = 1 ; i < this.all_tails.length ; i++)
    {
    tail = this.all_tails[ i ];


    if ( checkCollision( firstX, firstY, firstWidth, firstHeight, tail.getX(), tail.getY(), tail.getWidth(), tail.getHeight() ) == true )
        {
        console.log('collision');
        }
    }
};



window.Snake = Snake;

}(window));