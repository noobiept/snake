import { getAsset } from '../other/preload.js';
import { Grid, GridItem, GridPosition, ItemType } from "./grid.js";


/**
 * If the food is eaten by a snake, what are the effects.
 */
interface EatenEffect {
    tails: number;  // number of tails added
}


/**
 * The base 'Food' element that on collision with a snake gives some effects to the snake (by default it adds 1 tail).
 */
export default class Food implements GridItem {
    shape: createjs.Bitmap;
    position: GridPosition;
    readonly type: ItemType = ItemType.food;
    readonly eaten: EatenEffect = { tails: 1 };


    constructor() {
        this.shape = this.draw();
        this.position = {
            column: 0,
            line: 0
        };
    }


    draw() {
        var food = new createjs.Bitmap( getAsset( 'apple' ) );

        food.regX = Grid.halfSize;
        food.regY = Grid.halfSize;

        return food;
    }
}
