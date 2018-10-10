import Snake from './snake.js';
import { STAGE } from "./main.js";
import { getAsset } from './preload.js';
import { GridItem, Position, ItemType } from "./grid.js";


/**
 * If the food is eaten by a snake, what are the effects.
 */
interface EatenEffect {
    tails: number;  // number of tails added
}


export default class Food implements GridItem {
    static FOOD_WIDTH = 10;
    static FOOD_HEIGHT = 10;

    protected width: number;
    protected height: number;
    shape: createjs.Bitmap;
    position: Position;
    readonly type: ItemType = ItemType.food;
    readonly eaten: EatenEffect = { tails: 1 };


    constructor() {
        this.width = Food.FOOD_WIDTH;
        this.height = Food.FOOD_HEIGHT;
        this.shape = this.draw();
        this.position = {
            column: 0,
            line: 0
        };
    }


    draw() {
        var width = this.width;
        var height = this.height;

        var food = new createjs.Bitmap( getAsset( 'apple' ) );

        food.regX = width / 2;
        food.regY = height / 2;

        return food;
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
