class Wall
{
static ALL_WALLS: Wall[] = [];

private width: number;
private height: number;
private shape: createjs.Shape;


constructor( x: number, y: number, width: number, height: number )
    {
    this.width = width;
    this.height = height;

    this.draw( x, y, width, height );

    Wall.ALL_WALLS.push( this );
    }


draw( x: number, y: number, width: number, height: number )
    {
    var wall = new createjs.Shape();

    wall.regX = width / 2;
    wall.regY = height / 2;

    wall.x = x;
    wall.y = y;

    var g = wall.graphics;

    g.beginFill( 'white' );
    g.drawRoundRect( 0, 0, width, height, 2 );

    STAGE.addChild( wall );

    this.shape = wall;
    }


/*
    Change the shape's color to red, to signal that the wall as been hit
 */
asBeenHit()
    {
    var g = this.shape.graphics;

    g.beginFill( 'red' );
    g.drawRoundRect( 0, 0, this.width, this.height, 2 );
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


remove()
    {
    var position = Wall.ALL_WALLS.indexOf( this );

    Wall.ALL_WALLS.splice( position, 1 );

    STAGE.removeChild( this.shape );
    }


static removeAll()
    {
    for (var i = 0 ; i < Wall.ALL_WALLS.length ; i++)
        {
        Wall.ALL_WALLS[ i ].remove();
        i--;    // since we're messing around with the ALL_FOOD array
        }
    }
}
