var Wall = (function () {
    function Wall(x, y, width, height) {
        this.width = width;
        this.height = height;
        this.draw(x, y, width, height);
        Wall.ALL_WALLS.push(this);
    }
    Wall.prototype.draw = function (x, y, width, height) {
        var wall = new createjs.Shape();
        wall.regX = width / 2;
        wall.regY = height / 2;
        wall.x = x;
        wall.y = y;
        var g = wall.graphics;
        g.beginFill('white');
        g.drawRoundRect(0, 0, width, height, 2);
        STAGE.addChild(wall);
        this.shape = wall;
    };
    /*
        Change the shape's color to red, to signal that the wall as been hit
     */
    Wall.prototype.asBeenHit = function () {
        var g = this.shape.graphics;
        g.beginFill('red');
        g.drawRoundRect(0, 0, this.width, this.height, 2);
    };
    Wall.prototype.getX = function () {
        return this.shape.x;
    };
    Wall.prototype.getY = function () {
        return this.shape.y;
    };
    Wall.prototype.getWidth = function () {
        return this.width;
    };
    Wall.prototype.getHeight = function () {
        return this.height;
    };
    Wall.prototype.remove = function () {
        var position = Wall.ALL_WALLS.indexOf(this);
        Wall.ALL_WALLS.splice(position, 1);
        STAGE.removeChild(this.shape);
    };
    Wall.removeAll = function () {
        for (var i = 0; i < Wall.ALL_WALLS.length; i++) {
            Wall.ALL_WALLS[i].remove();
            i--; // since we're messing around with the ALL_FOOD array
        }
    };
    Wall.ALL_WALLS = [];
    return Wall;
}());
