interface SnakeArgs
    {
    x: number;
    y: number;
    startingDirection: Direction;
    color: string;
    keyboardMapping: KeyboardMapping;
    }


class Snake
{
static ALL_SNAKES: Snake[] = [];

starting_direction: Direction;
color: string;

private all_tails: Tail[];
private keys_held: { left: boolean; right: boolean; up: boolean; down: boolean };
private keyboard_mapping: KeyboardMapping;
private first_tail: Tail;


constructor( args: SnakeArgs )
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

    Snake.ALL_SNAKES.push( this );

        // add a starting tail
    this.first_tail = this.addTail();

    this.first_tail.position( args.x, args.y );
    this.first_tail.type = ElementsType.snake; // the first tail represents the head of the snake, so it has a different type
    }


static removeAll()
    {
    for (var i = 0 ; i < Snake.ALL_SNAKES.length ; i++)
        {
        Snake.ALL_SNAKES[ i ].remove();
        i--;    // we're removing from the array
        }
    }


remove()
    {
    var position = Snake.ALL_SNAKES.indexOf( this );

    Snake.ALL_SNAKES.splice( position, 1 );

    var tail;

    for (var i = 0 ; i < this.all_tails.length ; i++)
        {
        tail = this.all_tails[ i ];
        tail.remove();
        }
    }


/*
    Add a new tail at the end
 */
addTail()
    {
    var tail = new Tail( this );
    this.all_tails.push( tail );

    GameMenu.updateScore( Snake.ALL_SNAKES.indexOf( this ), this.all_tails.length );

    return tail;
    }


/*
    Return the position of the first tail (so, of the snake)
 */
getX()
    {
    return this.first_tail.getX();
    }


getY()
    {
    return this.first_tail.getY();
    }


/*
    newDirection (of the DIR variable)
 */
changeDirection( newDirection: Direction )
    {
    var currentDirection = this.getDirection();

        // already going that way
    if ( currentDirection == newDirection )
        {
        return;
        }

        // don't allow to go to the opposing direction
    if ( (currentDirection == Direction.left && newDirection == Direction.right) ||
        (currentDirection == Direction.right && newDirection == Direction.left) ||
        (currentDirection == Direction.up && newDirection == Direction.down) ||
        (currentDirection == Direction.down && newDirection == Direction.up) )
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
    }


getNumberOfTails()
    {
    return this.all_tails.length;
    }


getTail( position: number )
    {
    if ( position < 0 || position >= this.all_tails.length )
        {
        return null;
        }

    return this.all_tails[ position ];
    }


getDirection()
    {
    return this.first_tail.direction;
    }


onKeyDown( keyCode: number )
    {
    var keysHeld = this.keys_held;
    var keyboardMapping = this.keyboard_mapping;

    switch( keyCode )
        {
        case keyboardMapping.left:
        case keyboardMapping.left2:

            keysHeld.left = true;
            return false;

        case keyboardMapping.right:
        case keyboardMapping.right2:

            keysHeld.right = true;
            return false;

        case keyboardMapping.up:
        case keyboardMapping.up2:

            keysHeld.up = true;
            return false;

        case keyboardMapping.down:
        case keyboardMapping.down2:

            keysHeld.down = true;
            return false;
        }

    return true;
    }


onKeyUp( keyCode: number )
    {
    var keysHeld = this.keys_held;
    var keyboardMapping = this.keyboard_mapping;

    switch( keyCode )
        {
        case keyboardMapping.left:
        case keyboardMapping.left2:

            keysHeld.left = false;
            return false;

        case keyboardMapping.right:
        case keyboardMapping.right2:

            keysHeld.right = false;
            return false;

        case keyboardMapping.up:
        case keyboardMapping.up2:

            keysHeld.up = false;
            return false;

        case keyboardMapping.down:
        case keyboardMapping.down2:

            keysHeld.down = false;
            return false;
        }

    return true;
    }


tick()
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
    for (a = 0 ; a < Food.ALL_FOOD.length ; a++)
        {
        var food = Food.ALL_FOOD[ a ];
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

    for (i = 0 ; i < Wall.ALL_WALLS.length ; i++)
        {
        wall = Wall.ALL_WALLS[ i ];

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
    }


/*
    Check if a collision happened between any of the snakes
 */
static checkCollision()
    {
    var a = 0;
    var b = 0;
    var snake1;
    var snake2;

    for ( a = 0 ; a < Snake.ALL_SNAKES.length - 1 ; a++ )
        {
        snake1 = Snake.ALL_SNAKES[ a ];

        for ( b = a + 1 ; b < Snake.ALL_SNAKES.length ; b++ )
            {
            snake2 = Snake.ALL_SNAKES[ b ];


            var tail_1 = snake1.first_tail;
            var tail_2 = snake2.first_tail;


            var all_tails_1 = snake1.all_tails;
            var all_tails_2 =  snake2.all_tails;

            var check = function( x: number, y: number, width: number, height: number, all_tails: Tail[] )
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
    }
}
