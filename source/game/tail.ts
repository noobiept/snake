import { Direction, Path } from "../types.js";
import { Grid } from "./grid.js";
import { ItemType, type GridItem, type GridPosition } from "./grid.types.js";

type TailArgs = {
    color: string;
    direction: Direction;
    path: Path[];
    onAdd: (item: GridItem) => void;
    onRemove: (item: GridItem) => void;
};

/**
 * A snake is made of several tail elements one after the other.
 */
export default class Tail implements GridItem {
    readonly type = ItemType.tail;
    private direction: Direction;
    position: GridPosition;
    private path: Path[];
    private onRemove: (item: GridItem) => void;
    readonly shape: createjs.Shape;
    readonly color: string;

    constructor({ color, path, direction, onAdd, onRemove }: TailArgs) {
        this.color = color;
        this.path = path;
        this.direction = direction;
        this.position = {
            column: 0,
            line: 0,
        };
        this.shape = this.draw();
        this.onRemove = onRemove;

        onAdd(this);
    }

    /**
     * Draw the 'Tail' shape.
     */
    draw() {
        const snakeTail = new createjs.Shape();

        snakeTail.regX = Grid.halfSize;
        snakeTail.regY = Grid.halfSize;

        const g = snakeTail.graphics;

        g.beginFill(this.color);
        g.drawRoundRect(0, 0, Grid.size, Grid.size, 2);

        return snakeTail;
    }

    /**
     * Change the shape's color to red, to signal that the tail as been hit.
     */
    asBeenHit() {
        const g = this.shape.graphics;

        g.beginFill("red");
        g.drawRoundRect(0, 0, Grid.size, Grid.size, 2);
    }

    /**
     * Remove the 'Tail' shape.
     */
    remove() {
        this.onRemove(this);
    }

    /**
     * Add a new direction to the tail path.
     */
    addNewDirection(path: Path) {
        this.path.push(path);
    }

    /**
     * Get the next position based on the direction the tail is going.
     */
    nextPosition() {
        const current = this.position;

        switch (this.direction) {
            case Direction.west:
                return {
                    column: current.column - 1,
                    line: current.line,
                };

            case Direction.east:
                return {
                    column: current.column + 1,
                    line: current.line,
                };

            case Direction.north:
                return {
                    column: current.column,
                    line: current.line - 1,
                };

            case Direction.south:
                return {
                    column: current.column,
                    line: current.line + 1,
                };

            default:
                throw Error("Invalid 'tail' direction.");
        }
    }

    /**
     * Return a copy of the current path that is set for this tail (deep clone).
     */
    clonePath() {
        // using JSON here to do a copy of the array of objects (we can't just copy the references for the object)
        return JSON.parse(JSON.stringify(this.path));
    }

    /**
     * Return the direction this tail is currently going towards.
     */
    getCurrentDirection() {
        return this.direction;
    }

    /**
     * Deal with tail movement.
     */
    tick() {
        // have to check if this tail needs to change direction or not
        let direction = this.direction;

        if (this.path.length !== 0) {
            const checkpoint = this.path[0];
            const current = this.position;

            // check if its on the right position
            if (
                checkpoint.column === current.column &&
                checkpoint.line === current.line
            ) {
                // new direction
                direction = checkpoint.direction;

                this.direction = direction;

                // remove the path checkpoint
                this.path.splice(0, 1);
            }
        }
    }
}
