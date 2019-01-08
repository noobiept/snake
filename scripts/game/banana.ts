import Food from './food.js';
import { getAsset } from '../other/preload.js';
import { Grid, ItemType } from './grid.js';


export default class Banana extends Food {

    readonly type = ItemType.food;
    readonly eaten = { tails: 1 };


    draw() {
        const banana = new createjs.Bitmap( getAsset( 'banana' ) );

        banana.regX = Grid.halfSize;
        banana.regY = Grid.halfSize;

        return banana;
    }
}
