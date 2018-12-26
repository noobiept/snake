import Food from './food.js';
import { getAsset } from '../other/preload.js';
import { Grid, ItemType } from "./grid.js";


export default class DoubleFood extends Food {

    readonly type = ItemType.doubleFood;
    readonly eaten = { tails: 2 };


    draw() {
        var food = new createjs.Bitmap( getAsset( 'orange' ) );

        food.regX = Grid.halfSize;
        food.regY = Grid.halfSize;

        return food;
    }
}
