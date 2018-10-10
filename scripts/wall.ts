import { STAGE } from './main.js';
import { GridItem, Position, ItemType } from "./grid.js";


export default class Wall implements GridItem {
    private width: number;
    private height: number;
    shape: createjs.Shape;
    position: Position;
    readonly type: ItemType = ItemType.wall;

    constructor( x: number, y: number, width: number, height: number ) {
        this.width = width;
        this.height = height;
        this.position = {
            column: 0,
            line: 0
        }

        this.shape = this.draw( x, y, width, height );
    }


    draw( x: number, y: number, width: number, height: number ) {
        var wall = new createjs.Shape();

        wall.regX = width / 2;
        wall.regY = height / 2;

        wall.x = x;
        wall.y = y;

        var g = wall.graphics;

        g.beginFill( 'white' );
        g.drawRoundRect( 0, 0, width, height, 2 );

        STAGE.addChild( wall );

        return wall;
    }


    /*
        Change the shape's color to red, to signal that the wall as been hit
     */
    asBeenHit() {
        var g = this.shape.graphics;

        g.beginFill( 'red' );
        g.drawRoundRect( 0, 0, this.width, this.height, 2 );
    }


    getX() {
        return this.shape.x;
    }


    getY() {
        return this.shape.y;
    }


    getWidth() {
        return this.width;
    }


    getHeight() {
        return this.height;
    }
}
