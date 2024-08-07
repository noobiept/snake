import { Grid } from "./grid";
import { GridItem, GridPosition, ItemType } from "./grid.types";

/**
 * A wall is an element that the snake can't go through.
 */
export default class Wall implements GridItem {
    readonly shape: createjs.Shape;
    position: GridPosition;
    readonly type: ItemType = ItemType.wall;

    constructor() {
        this.position = {
            column: 0,
            line: 0,
        };

        this.shape = this.draw();
    }

    /**
     * Draw the 'Wall' shape.
     */
    draw() {
        const wall = new createjs.Shape();

        wall.regX = Grid.halfSize;
        wall.regY = Grid.halfSize;

        const g = wall.graphics;

        g.beginFill("white");
        g.drawRoundRect(0, 0, Grid.size, Grid.size, 2);

        return wall;
    }

    /**
     * Change the shape's color to red, to signal that the wall as been hit.
     */
    asBeenHit() {
        const g = this.shape.graphics;

        g.beginFill("red");
        g.drawRoundRect(0, 0, Grid.size, Grid.size, 2);
    }
}
