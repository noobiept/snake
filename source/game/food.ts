import { getAsset, AssetName } from "../other/preload";
import { Grid } from "./grid";
import { GridItem, GridPosition, ItemType } from "./grid.types";

/**
 * If the food is eaten by a snake, what are the effects.
 */
interface EatenEffect {
    tails: number; // number of tails added
    speed?: {
        multiplier: number; // multiply the base speed by this factor
        duration: number; // reset the increase after a certain time
    };
}

interface FoodArgs {
    assetName: AssetName;
    eaten: EatenEffect;
}

/**
 * The base 'Food' element that on collision with a snake gives some effects to the snake (by default it adds 1 tail).
 */
export default abstract class Food implements GridItem {
    readonly shape: createjs.Bitmap;
    position: GridPosition;
    readonly type: ItemType = ItemType.food;
    readonly eaten: EatenEffect;

    constructor(args: FoodArgs) {
        this.shape = this.draw(args.assetName);
        this.eaten = args.eaten;
        this.position = {
            column: 0,
            line: 0,
        };
    }

    draw(assetName: AssetName) {
        const food = new createjs.Bitmap(getAsset(assetName));

        food.regX = Grid.halfSize;
        food.regY = Grid.halfSize;

        return food;
    }
}
