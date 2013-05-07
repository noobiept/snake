(function(window)
{
function Snake( x, y )
{
this.all_tails = [];


    // add a starting tail
this.first_tail = this.addTail();
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




window.Snake = Snake;

}(window));