import Food from './food.js';
import Snake from './snake.js';
import { getAsset } from './preload.js';
import { ItemType } from "./grid.js";


export default class DoubleFood extends Food {

    readonly type = ItemType.doubleFood;
    readonly eaten = { tails: 2 };


    draw() {
        var width = this.width;
        var height = this.height;

        var food = new createjs.Bitmap( getAsset( 'orange' ) );

        food.regX = width / 2;
        food.regY = height / 2;

        return food;
    }
}
