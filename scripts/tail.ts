import Snake from './snake.js';
import { Direction, Path, STAGE } from "./main.js";
import { Grid, GridItem, GridPosition, ItemType } from "./grid.js";


export default class Tail implements GridItem {
    readonly type = ItemType.tail;
    direction: Direction;
    position: GridPosition;

    snakeObject: Snake;
    path: Path[];
    shape: createjs.Shape;


    constructor( snakeObject: Snake, direction: Direction, path: Path[] ) {
        this.snakeObject = snakeObject;

        // draw it, and setup the physics body
        this.shape = this.draw();

        this.path = path;
        this.direction = direction;
        this.position = {
            column: 0,
            line: 0
        };
    }


    draw() {
        // createjs
        var snakeTail = new createjs.Shape();

        snakeTail.regX = Grid.halfSize;
        snakeTail.regY = Grid.halfSize;

        var g = snakeTail.graphics;

        g.beginFill( this.snakeObject.color );
        g.drawRoundRect( 0, 0, Grid.size, Grid.size, 2 );

        STAGE.addChild( snakeTail );

        return snakeTail;
    }


    /*
        Change the shape's color to red, to signal that the tail as been hit
     */
    asBeenHit() {
        var g = this.shape.graphics;

        g.beginFill( 'red' );
        g.drawRoundRect( 0, 0, Grid.size, Grid.size, 2 );
    }


    remove() {
        STAGE.removeChild( this.shape );
    }


    /**
     * Add a new direction to the tail path.
     */
    addNewDirection( path: Path ) {
        this.path.push( path );
    }


    /**
     * Get the next position based on the direction the tail is going.
     */
    nextPosition() {
        const current = this.position;

        switch ( this.direction ) {
            case Direction.left:
                return {
                    column: current.column - 1,
                    line: current.line
                };

            case Direction.right:
                return {
                    column: current.column + 1,
                    line: current.line
                };

            case Direction.up:
                return {
                    column: current.column,
                    line: current.line - 1
                };

            case Direction.down:
                return {
                    column: current.column,
                    line: current.line + 1
                };
        }
    }


    /**
     * Deal with tail movement.
     */
    tick() {
        // have to check if this tail needs to change direction or not
        var direction = this.direction;

        if ( this.path.length !== 0 ) {
            const checkpoint = this.path[ 0 ];
            const current = this.position;

            // check if its on the right position
            if ( checkpoint.column === current.column &&
                checkpoint.line === current.line ) {
                // new direction
                direction = checkpoint.direction;

                this.direction = direction;

                // remove the path checkpoint
                this.path.splice( 0, 1 );
            }
        }
    }
}
