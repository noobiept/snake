import Snake from './snake.js';
import { getAsset, STAGE } from "./main.js";


export default class Food {
    static ALL_FOOD: Food[] = [];
    static FOOD_WIDTH = 10;
    static FOOD_HEIGHT = 10;

    protected width: number;
    protected height: number;
    protected shape!: createjs.Bitmap;


    constructor( x: number, y: number ) {
        this.width = Food.FOOD_WIDTH;
        this.height = Food.FOOD_HEIGHT;

        this.draw( x, y );

        Food.ALL_FOOD.push( this );
    }


    draw( x: number, y: number ) {
        var width = this.width;
        var height = this.height;

        var food = new createjs.Bitmap( getAsset( 'apple' ) );

        food.regX = width / 2;
        food.regY = height / 2;

        food.x = x;
        food.y = y;

        STAGE.addChild( food );

        this.shape = food;
    }


    /*
        When there's a collision between the snake and the food, the food is 'eaten' (this applies the effects of that)
     */
    eat( snakeObject: Snake ) {
        snakeObject.addTail();
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


    remove() {
        var position = Food.ALL_FOOD.indexOf( this );

        Food.ALL_FOOD.splice( position, 1 );

        STAGE.removeChild( this.shape );
    }


    static removeAll() {
        for ( var i = 0; i < Food.ALL_FOOD.length; i++ ) {
            Food.ALL_FOOD[ i ].remove();
            i--;    // since we're messing around with the ALL_FOOD array
        }
    }
}
