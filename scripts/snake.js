(function(window)
{
var ALL_SNAKES = [];

function Snake( x, y )
{
this.all_tails = [];


    // add a starting tail
this.first_tail = this.addTail();

this.first_tail.position( x, y );
this.first_tail.type = ELEMENTS_TYPE.snake; // the first tail represents the head of the snake, so it has a different type

ALL_SNAKES.push( this );
}


Snake.removeAll = function()
{
for (var i = 0 ; i < ALL_SNAKES.length ; i++)
    {
    ALL_SNAKES[ i ].remove();
    }
};



Snake.prototype.remove = function()
{
var position = ALL_SNAKES.indexOf( this );

ALL_SNAKES.splice( position, 1 );

var tail;

for (var i = 0 ; i < this.all_tails.length ; i++)
    {
    tail = this.all_tails[ i ];

    tail.remove();
    }
};



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
var currentDirection = this.getDirection();

    // already going that way
if ( currentDirection == newDirection )
    {
    return;
    }

    // don't allow to go to the opposing direction
if ( (currentDirection == DIR.left && newDirection == DIR.right) ||
     (currentDirection == DIR.right && newDirection == DIR.left) ||
     (currentDirection == DIR.top && newDirection == DIR.bottom) ||
     (currentDirection == DIR.bottom && newDirection == DIR.top) )
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
var allTails = this.all_tails;

    // :: deal with the collision detection between the snake and tails :: //
    // 'i' starts at 1, to not check the first tail (that's the one we're comparing with)
for (var i = 1 ; i < allTails.length ; i++)
    {
    tail = allTails[ i ];


    if ( checkCollision( firstX, firstY, firstWidth, firstHeight, tail.getX(), tail.getY(), tail.getWidth(), tail.getHeight() ) == true )
        {
        gameOver();
        }
    }


var a, b;

    // :: check collision between the snake's tails and the food :: //
for (a = 0 ; a < ALL_FOOD.length ; a++)
    {
    var food = ALL_FOOD[ a ];
    var foodX = food.getX();
    var foodY = food.getY();
    var foodWidth = food.getWidth();
    var foodHeight = food.getHeight();

    for (b = 0 ; b < allTails.length ; b++)
        {
        tail = allTails[ b ];

        if ( checkCollision( foodX, foodY, foodWidth, foodHeight, tail.getX(), tail.getY(), tail.getWidth(), tail.getHeight() ) == true )
            {
            this.addTail();

            food.remove();
            a--;
            break;
            }
        }
    }


    // :: check collision between the snake and the walls :: //

var wall;

for (i = 0 ; i < ALL_WALLS.length ; i++)
    {
    wall = ALL_WALLS[ i ];

    if ( checkCollision( firstX, firstY, firstWidth, firstHeight, wall.getX(), wall.getY(), wall.getWidth(), wall.getHeight() ) )
        {
        gameOver();
        }
    }



    // :: deal with the movement of the tails :: //

for (i = 0 ; i < allTails.length ; i++)
    {
    tail = allTails[ i ];

        // have to check if this tail needs to change direction or not
    var direction = tail.direction;


    if ( tail.path.length !== 0 )
        {
        var checkpoint = tail.path[ 0 ];

        var checkX = checkpoint.x;
        var checkY = checkpoint.y;

        var x = tail.getX();
        var y = tail.getY();

            // check if its on the right position
        if ( isNextTo( x, y, checkX, checkY, 2 ) )  // the range has to be less than the tail's speed
            {
                // new direction
            direction = checkpoint.direction;

            tail.direction = direction;

                // remove the path checkpoint
            tail.path.splice( 0, 1 );
            }
        }

    tail.moveInDirection();
    }
};



window.Snake = Snake;
window.ALL_SNAKES = ALL_SNAKES;

}(window));
