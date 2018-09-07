class Tail
{
static TAIL_WIDTH = 10;    // width and height need to be the same value
static TAIL_HEIGHT = Tail.TAIL_WIDTH;

type: ElementsType;
direction: Direction;

private snakeObject: Snake;
private path: Path[];
private shape: createjs.Shape;
private width: number;
private height: number;


constructor( snakeObject: Snake )
    {
    this.snakeObject = snakeObject;

    var numberOfTails = snakeObject.getNumberOfTails();
    var x = 0, y = 0;
    var path = [];
    var direction;

        // first tail being added, add at the same position as the container (the x/y of the tail is relative to the snake)
    if ( numberOfTails == 0 )
        {
        x = 0;
        y = 0;
        direction = snakeObject.starting_direction;
        }

        // we position after the last tail, and it depends on what direction it is going
    else
        {
        var lastTail = snakeObject.getTail( numberOfTails - 1 );
        var lastDirection = lastTail.direction;

        if ( lastDirection == Direction.left )
            {
            x = lastTail.getX() + Tail.TAIL_WIDTH;
            y = lastTail.getY();
            }

        else if ( lastDirection == Direction.right )
            {
            x = lastTail.getX() - Tail.TAIL_WIDTH;
            y = lastTail.getY();
            }

        else if ( lastDirection == Direction.up )
            {
            x = lastTail.getX();
            y = lastTail.getY() + Tail.TAIL_HEIGHT;
            }

        else if ( lastDirection == Direction.down )
            {
            x = lastTail.getX();
            y = lastTail.getY() - Tail.TAIL_HEIGHT;
            }

            // this tail continues the same path as the previous last one
            // using JSON here to do a copy of the array of objects (we can't just copy the references for the object)
        var pathJson = JSON.stringify( lastTail.path );
        path = JSON.parse( pathJson );

        direction = lastTail.direction;
        }

        // draw it, and setup the physics body
    this.draw( x, y );

    this.type = ElementsType.tail;
    this.path = path;
    this.direction = direction;
    }


draw( x: number, y: number )
    {
        // createjs
    var snakeTail = new createjs.Shape();

    snakeTail.regX = Tail.TAIL_WIDTH / 2;
    snakeTail.regY = Tail.TAIL_HEIGHT / 2;

    snakeTail.x = x;
    snakeTail.y = y;

    var g = snakeTail.graphics;

    g.beginFill( this.snakeObject.color );
    g.drawRoundRect( 0, 0, Tail.TAIL_WIDTH, Tail.TAIL_HEIGHT, 2 );

    STAGE.addChild( snakeTail );

        // set the properties to the object
    this.shape = snakeTail;

    this.width = Tail.TAIL_WIDTH;
    this.height = Tail.TAIL_HEIGHT;
    }


/*
    Change the shape's color to red, to signal that the tail as been hit
 */
asBeenHit()
    {
    var g = this.shape.graphics;

    g.beginFill( 'red' );
    g.drawRoundRect( 0, 0, Tail.TAIL_WIDTH, Tail.TAIL_HEIGHT, 2 );
    }


remove()
    {
    STAGE.removeChild( this.shape );
    }


/*
    position on the canvas
 */
position( x: number, y: number )
    {
    return this.move( x, y, 0, 0 );
    }


/*
    move in relation to the current position (or a position given)
 */
move( x: number, y?: number, startX?: number, startY?: number )
    {
    var canvasWidth = Options.getCanvasWidth();
    var canvasHeight = Options.getCanvasHeight();

    if ( typeof x == 'undefined' )
        {
        x = 0;
        }

    if ( typeof y == 'undefined' )
        {
        y = 0;
        }

    if ( typeof startX == 'undefined' )
        {
        startX = this.getX();
        }

    if ( typeof startY == 'undefined' )
        {
        startY = this.getY();
        }

    var nextX = startX + x;
    var nextY = startY + y;

        // see if outside of canvas (if so, move to the other side)
    if ( nextX < 0 )
        {
        nextX = canvasWidth;
        }

    else if ( nextX > canvasWidth )
        {
        nextX = 0;
        }


    if ( nextY < 0 )
        {
        nextY = canvasHeight;
        }

    else if ( nextY > canvasHeight )
        {
        nextY = 0;
        }

    this.shape.x = nextX;
    this.shape.y = nextY;
    }


getX()
    {
    return this.shape.x;
    }


getY()
    {
    return this.shape.y;
    }


getWidth()
    {
    return this.width;
    }


getHeight()
    {
    return this.height;
    }


getType()
    {
    return this.type;
    }


/*
    Move in the current direction
 */
moveInDirection()
    {
        // the speed has to be the same value as the width/height so that when turning the tails, they don't overlap
    var speed = Tail.TAIL_WIDTH;
    var direction = this.direction;

        // when moving diagonally (45 degrees), we have to slow down the x and y
        // we have a triangle, and want the hypotenuse to be 'speed', with angle of 45º (pi / 4)
        // sin(angle) = opposite / hypotenuse
        // cos(angle) = adjacent / hypotenuse

        // x = cos( pi / 4 ) -> 0.707
        // y = sin( pi / 4 ) -> 0.707

        // here we're only moving through 'x' or 'y', so just need 'speed'
    if ( direction == Direction.left )
        {
        this.move( -speed );
        }

    else if ( direction == Direction.right )
        {
        this.move( speed );
        }

    else if ( direction == Direction.up )
        {
        this.move( 0, -speed );
        }

    else if ( direction == Direction.down )
        {
        this.move( 0, speed );
        }
    }
}
