(function(window)
{
var ALL_SNAKES = [];

/*
    Arguments (and object with):

        x
        y
        startingDirection
        color
        keyboardMapping
 */

function Snake( args )
{
this.all_tails = [];
this.starting_direction = args.startingDirection;
this.color = args.color;

    // keys being pressed/held
this.keys_held = {
    left  : false,
    right : false,
    up    : false,
    down  : false
    };


    // tells what key represent the up key held, the down etc (each player will have a different set of keys)
    // for example: { left: EVENT_KEY.a, right: EVENT_KEY.d, (...) }
this.keyboard_mapping = args.keyboardMapping;


    // add a starting tail
this.first_tail = this.addTail();

this.first_tail.position( args.x, args.y );
this.first_tail.type = ELEMENTS_TYPE.snake; // the first tail represents the head of the snake, so it has a different type

ALL_SNAKES.push( this );
}


Snake.removeAll = function()
{
for (var i = 0 ; i < ALL_SNAKES.length ; i++)
    {
    ALL_SNAKES[ i ].remove();
    i--;    // we're removing from the array
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


if ( this.score_element )
    {
    $( this.score_element ).text( this.all_tails.length );
    }


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
     (currentDirection == DIR.up && newDirection == DIR.down) ||
     (currentDirection == DIR.down && newDirection == DIR.up) )
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


/*
    To display the number of tails, associate an html element, where we're changing the .text() whenever a tail is added
 */

Snake.prototype.setScoreElement = function( scoreElement )
{
this.score_element = scoreElement;

$( this.score_element ).text( this.all_tails.length );
};




Snake.prototype.onKeyDown = function( keyCode )
{
var keysHeld = this.keys_held;
var keyboardMapping = this.keyboard_mapping;

switch( keyCode )
    {
    case keyboardMapping.left:

        keysHeld.left = true;
        return false;

    case keyboardMapping.right:

        keysHeld.right = true;
        return false;

    case keyboardMapping.up:

        keysHeld.up = true;
        return false;

    case keyboardMapping.down:

        keysHeld.down = true;
        return false;
    }

return true;
};


Snake.prototype.onKeyUp = function( keyCode )
{
var keysHeld = this.keys_held;
var keyboardMapping = this.keyboard_mapping;

switch( keyCode )
    {
    case keyboardMapping.left:

        keysHeld.left = false;
        return false;

    case keyboardMapping.right:

        keysHeld.right = false;
        return false;

    case keyboardMapping.up:

        keysHeld.up = false;
        return false;

    case keyboardMapping.down:

        keysHeld.down = false;
        return false;
    }

return true;
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
        tail.asBeenHit();

        Game.over();
        return;
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
            food.eat( this );

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
        wall.asBeenHit();

        Game.over();
        return;
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


/*
    Check if a collision happened between any of the snakes
 */

Snake.checkCollision = function()
{
var a = 0;
var b = 0;
var snake1;
var snake2;

for ( a = 0 ; a < ALL_SNAKES.length - 1 ; a++ )
    {
    snake1 = ALL_SNAKES[ a ];

    for ( b = a + 1 ; b < ALL_SNAKES.length ; b++ )
        {
        snake2 = ALL_SNAKES[ b ];


        var tail_1 = snake1.first_tail;
        var tail_2 = snake2.first_tail;


        var all_tails_1 = snake1.all_tails;
        var all_tails_2 =  snake2.all_tails;



        var check = function( x, y, width, height, all_tails )
            {
            var tail;

                // deal with the collision detection between a snake and the tails from the other snake
            for (var i = 0 ; i < all_tails.length ; i++)
                {
                tail = all_tails[ i ];


                if ( checkCollision( x, y, width, height, tail.getX(), tail.getY(), tail.getWidth(), tail.getHeight() ) == true )
                    {
                    tail.asBeenHit();

                    return true;
                    }
                }

            return false;
            };

        if ( check( tail_1.getX(), tail_1.getY(), tail_1.getWidth(), tail_1.getHeight(), all_tails_2 ) == true )
            {
                // player 2 won (player1 collided with player2)
            Game.over( 2 );

            return true;
            }


        if ( check( tail_2.getX(), tail_2.getY(), tail_2.getWidth(), tail_2.getHeight(), all_tails_1 ) == true )
            {
                // player 1 won
            Game.over( 1 );

            return true;
            }
        }
    }


return false;
};



window.Snake = Snake;
window.ALL_SNAKES = ALL_SNAKES;

}(window));
