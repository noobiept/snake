/// <reference path="food.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DoubleFood = (function (_super) {
    __extends(DoubleFood, _super);
    function DoubleFood(x, y) {
        _super.call(this, x, y);
    }
    DoubleFood.prototype.draw = function (x, y) {
        var width = this.width;
        var height = this.height;
        var food = new createjs.Bitmap(PRELOAD.getResult('orange'));
        food.regX = width / 2;
        food.regY = height / 2;
        food.x = x;
        food.y = y;
        STAGE.addChild(food);
        this.shape = food;
    };
    DoubleFood.prototype.eat = function (snakeObject) {
        snakeObject.addTail();
        snakeObject.addTail();
        //HERE and increase momentarily the snake's speed, as the disadvantage
    };
    return DoubleFood;
}(Food));
//# sourceMappingURL=double_food.js.map