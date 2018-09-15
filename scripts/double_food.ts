import Food from './food.js';
import Snake from './snake.js';
import { getAsset, STAGE } from './main.js';


export default class DoubleFood extends Food {
    constructor( x: number, y: number ) {
        super( x, y );
    }


    draw( x: number, y: number ) {
        var width = this.width;
        var height = this.height;

        var food = new createjs.Bitmap( getAsset( 'orange' ) );

        food.regX = width / 2;
        food.regY = height / 2;

        food.x = x;
        food.y = y;

        STAGE.addChild( food );

        this.shape = food;
    }


    eat( snakeObject: Snake ) {
        snakeObject.addTail();
        snakeObject.addTail();

        //HERE and increase momentarily the snake's speed, as the disadvantage
    }
}
