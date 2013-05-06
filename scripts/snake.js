(function(window)
{
function Snake( x, y )
{
var container = new createjs.Container();

container.x = x;
container.y = y;

this.container = container;

this.all_tails = [];

STAGE.addChild( container );

    // add a starting tail
this.addTail();
}


/*
    Add a new tail at the end
 */

Snake.prototype.addTail = function()
{
var tail = new Tail( this );

this.all_tails.push( tail );
};



/*
    newDirection (of the DIR variable)
 */

Snake.prototype.changeDirection = function( newDirection )
{
var container = this.container;

var x = container.x;
var y = container.y;

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