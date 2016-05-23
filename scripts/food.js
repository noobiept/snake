var Food = (function () {
    function Food(x, y) {
        this.width = Food.FOOD_WIDTH;
        this.height = Food.FOOD_HEIGHT;
        this.draw(x, y);
        Food.ALL_FOOD.push(this);
    }
    Food.prototype.draw = function (x, y) {
        var width = this.width;
        var height = this.height;
        var food = new createjs.Bitmap(PRELOAD.getResult('apple'));
        food.regX = width / 2;
        food.regY = height / 2;
        food.x = x;
        food.y = y;
        STAGE.addChild(food);
        this.shape = food;
    };
    /*
        When there's a collision between the snake and the food, the food is 'eaten' (this applies the effects of that)
     */
    Food.prototype.eat = function (snakeObject) {
        snakeObject.addTail();
    };
    Food.prototype.getX = function () {
        return this.shape.x;
    };
    Food.prototype.getY = function () {
        return this.shape.y;
    };
    Food.prototype.getWidth = function () {
        return this.width;
    };
    Food.prototype.getHeight = function () {
        return this.height;
    };
    Food.prototype.remove = function () {
        var position = Food.ALL_FOOD.indexOf(this);
        Food.ALL_FOOD.splice(position, 1);
        STAGE.removeChild(this.shape);
    };
    Food.removeAll = function () {
        for (var i = 0; i < Food.ALL_FOOD.length; i++) {
            Food.ALL_FOOD[i].remove();
            i--; // since we're messing around with the ALL_FOOD array
        }
    };
    Food.ALL_FOOD = [];
    Food.FOOD_WIDTH = 10;
    Food.FOOD_HEIGHT = 10;
    return Food;
}());
//# sourceMappingURL=food.js.map