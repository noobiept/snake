var Game;
(function (Game) {
    var INTERVALS = [];
    // the time until we add a new food/wall/etc
    // depends on the difficulty level
    // the order matters (get the difficulty from Options, which will be the position in this)
    var FOOD_TIMINGS = [1000, 2500];
    var DOUBLE_FOOD_TIMINGS = [5000, 8000];
    var WALL_TIMINGS = [4000, 3000];
    // in milliseconds
    // the order is according to the difficulty (so on normal mode, we get the first element, so 50ms)
    var TIME_BETWEEN_TICKS = [50, 35];
    var TIMER;
    var TWO_PLAYER_MODE = false;
    var MAP_NAME;
    var GAME_OVER = false;
    function init() {
        TIMER = new Timer(GameMenu.updateTimer);
    }
    Game.init = init;
    function start(mapName, twoPlayersMode) {
        if (typeof twoPlayersMode == 'undefined') {
            twoPlayersMode = false;
        }
        GAME_OVER = false;
        TWO_PLAYER_MODE = twoPlayersMode;
        MAP_NAME = mapName;
        TIMER.restart();
        GameMenu.updateTimer(TIMER);
        clearCanvas();
        var difficulty = Options.getDifficulty();
        var canvasWidth = Options.getCanvasWidth();
        var canvasHeight = Options.getCanvasHeight();
        // player 1 : wasd
        // player 2 : arrow keys
        if (twoPlayersMode) {
            // 1 player (on left side of canvas, moving to the right)
            new Snake({
                x: 50,
                y: canvasHeight / 2,
                startingDirection: Direction.right,
                color: 'green',
                keyboardMapping: {
                    left: EVENT_KEY.a,
                    right: EVENT_KEY.d,
                    up: EVENT_KEY.w,
                    down: EVENT_KEY.s
                }
            });
            // 2 player (on right side of canvas, moving to the left)
            new Snake({
                x: canvasWidth - 50,
                y: canvasHeight / 2,
                startingDirection: Direction.left,
                color: 'dodgerblue',
                keyboardMapping: {
                    left: EVENT_KEY.leftArrow,
                    right: EVENT_KEY.rightArrow,
                    up: EVENT_KEY.upArrow,
                    down: EVENT_KEY.downArrow
                }
            });
        }
        else {
            // 1 player (on left side of canvas, moving to the right)
            new Snake({
                x: 50,
                y: canvasHeight / 2,
                startingDirection: Direction.right,
                color: 'green',
                keyboardMapping: {
                    left: EVENT_KEY.a,
                    left2: EVENT_KEY.leftArrow,
                    right: EVENT_KEY.d,
                    right2: EVENT_KEY.rightArrow,
                    up: EVENT_KEY.w,
                    up2: EVENT_KEY.upArrow,
                    down: EVENT_KEY.s,
                    down2: EVENT_KEY.downArrow
                }
            });
        }
        createjs.Ticker.setInterval(TIME_BETWEEN_TICKS[difficulty]);
        // add a wall around the canvas (so that you can't pass through from one side to the other)
        if (Options.getFrame()) {
            new Wall(0, canvasHeight / 2, 5, canvasHeight); // left
            new Wall(canvasWidth / 2, 0, canvasWidth, 5); // top
            new Wall(canvasWidth, canvasHeight / 2, 5, canvasHeight); // right
            new Wall(canvasWidth / 2, canvasHeight, canvasWidth, 5); //bottom
        }
        // add food
        var interval = new Interval(function () {
            var x, y;
            // don't add food on top of the walls (otherwise its impossible to get it)
            // try 5 times, otherwise just use whatever position
            for (var i = 0; i < 5; i++) {
                x = getRandomInt(0, canvasWidth);
                y = getRandomInt(0, canvasHeight);
                if (!elementCollision(x, y, Food.FOOD_WIDTH, Food.FOOD_HEIGHT, Wall.ALL_WALLS)) {
                    break;
                }
            }
            new Food(x, y);
        }, FOOD_TIMINGS[difficulty]);
        // saving a reference to this, so that we can stop this later
        INTERVALS.push(interval);
        // add double food
        interval = new Interval(function () {
            var x, y;
            // don't add food on top of the walls (otherwise its impossible to get it)
            // try 5 times, otherwise just use whatever position
            for (var i = 0; i < 5; i++) {
                x = getRandomInt(0, canvasWidth);
                y = getRandomInt(0, canvasHeight);
                if (!elementCollision(x, y, Food.FOOD_WIDTH, Food.FOOD_HEIGHT, Wall.ALL_WALLS)) {
                    break;
                }
            }
            new DoubleFood(x, y);
        }, DOUBLE_FOOD_TIMINGS[difficulty]);
        INTERVALS.push(interval);
        setupWalls(mapName);
        GameMenu.show(TWO_PLAYER_MODE);
    }
    Game.start = start;
    /**
     * Setup the map walls (depends on the map type).
     * - `random` : Adds walls randomly in the map.
     * - `stairs` : Stair like walls.
     * - `lines`  : Horizontal lines walls.
     * - `empty`  : No walls added.
     */
    function setupWalls(mapName) {
        var difficulty = Options.getDifficulty();
        // randomly add walls in the map
        if (mapName === 'random') {
            var interval = new Interval(function () {
                var x, y, width, height, verticalOrientation;
                var canvasWidth = Options.getCanvasWidth();
                var canvasHeight = Options.getCanvasHeight();
                var maxWallWidth = canvasWidth * 0.2;
                var minWallWidth = canvasWidth * 0.1;
                var maxWallHeight = canvasHeight * 0.2;
                var minWallHeight = canvasHeight * 0.1;
                // don't add walls on top of the food (otherwise its impossible to get it)
                // try 5 times, otherwise just use whatever position
                for (var i = 0; i < 5; i++) {
                    x = getRandomInt(0, canvasWidth);
                    y = getRandomInt(0, canvasHeight);
                    verticalOrientation = getRandomInt(0, 1);
                    if (verticalOrientation) {
                        width = 10;
                        height = getRandomInt(minWallHeight, maxWallHeight);
                    }
                    else {
                        width = getRandomInt(minWallWidth, maxWallWidth);
                        height = 10;
                    }
                    if (!elementCollision(x, y, width, height, Food.ALL_FOOD)) {
                        break;
                    }
                }
                // we have to make sure it doesnt add on top of the snake
                //HERE it could still be added on top of the tails?.. isn't as bad since what matters in the collision is the first tail
                // also we could add the wall on top of food (since we're changing the values we checked above)
                for (i = 0; i < Snake.ALL_SNAKES.length; i++) {
                    var snakeX = Snake.ALL_SNAKES[i].getX();
                    var snakeY = Snake.ALL_SNAKES[i].getY();
                    var margin = 60;
                    // means the wall position is close to the snake
                    if (snakeX > x - margin && snakeX < x + margin &&
                        snakeY > y - margin && snakeY < y + margin) {
                        x += 100;
                        y += 100;
                        // to make sure it doesn't go out of bounds
                        x = checkOverflowPosition(x, canvasWidth);
                        y = checkOverflowPosition(y, canvasHeight);
                    }
                }
                new Wall(x, y, width, height);
            }, WALL_TIMINGS[difficulty]);
            INTERVALS.push(interval);
        }
        else if (mapName === 'stairs') {
            var canvasWidth = Options.getCanvasWidth();
            var canvasHeight = Options.getCanvasHeight();
            var width = canvasWidth * 0.1;
            var widthThickness = canvasWidth * 0.01;
            var height = canvasHeight * 0.06;
            var heightThickness = canvasHeight * 0.01;
            var steps = 4;
            var xOffset = canvasWidth / (steps + 1);
            var yOffset = canvasHeight / (steps + 1);
            for (var a = 0; a < steps; a++) {
                var x = (a + 1) * xOffset;
                var y = (a + 1) * yOffset;
                new Wall(x, y, width, widthThickness);
                new Wall(x + width / 2, y + height / 2, heightThickness, height);
            }
        }
        else if (mapName === 'lines') {
            var lines = 4;
            var canvasWidth = Options.getCanvasWidth();
            var canvasHeight = Options.getCanvasHeight();
            var x1 = canvasWidth * 0.15;
            var x2 = canvasWidth * 0.5;
            var x3 = canvasWidth * 0.85;
            var yDiff = canvasHeight / (lines + 1);
            var width = canvasWidth * 0.2;
            var height = canvasHeight * 0.01;
            for (var a = 0; a < lines; a++) {
                var y = yDiff * (a + 1);
                new Wall(x1, y, width, height);
                new Wall(x2, y, width, height);
                new Wall(x3, y, width, height);
            }
        }
    }
    /**
     * Check if a food/wall position is colliding with any of the  walls/foods.
     */
    function elementCollision(x, y, width, height, elementsArray) {
        for (var i = 0; i < elementsArray.length; i++) {
            var element = elementsArray[i];
            if (checkCollision(x, y, width, height, element.getX(), element.getY(), element.getWidth(), element.getHeight())) {
                return true;
            }
        }
        return false;
    }
    /*
        When the snake hits its tails for example
    
        arguments:
    
            whoWon : if provided, tells which player (1 or 2) won, otherwise check the number of tails (for 2 players only)
    
     */
    function over(whoWon) {
        GAME_OVER = true;
        var text = 'Game Over<br />';
        if (TWO_PLAYER_MODE) {
            if (typeof whoWon != 'undefined') {
                text += 'Player ' + whoWon + ' Won!';
            }
            else {
                var player1_score = Snake.ALL_SNAKES[0].getNumberOfTails();
                var player2_score = Snake.ALL_SNAKES[1].getNumberOfTails();
                if (player1_score > player2_score) {
                    text += 'Player 1 Won!';
                }
                else if (player2_score > player1_score) {
                    text += 'Player 2 Won!';
                }
                else {
                    text += 'Draw!';
                }
            }
        }
        else {
            text = 'Game Over<br />Score: ' + Snake.ALL_SNAKES[0].getNumberOfTails();
        }
        var message = new Message({
            text: text,
            cssClass: 'Message-gameOver'
        });
        pause();
        addScores();
        window.setTimeout(function () {
            message.remove();
            clear();
            start(MAP_NAME, TWO_PLAYER_MODE);
        }, 2000);
    }
    Game.over = over;
    ;
    /**
     * Add the current scores of both players to the high-score (score will be considered if its higher than the current ones).
     */
    function addScores() {
        TIMER.stop();
        // add the scores from all the snakes (the high-score is an overall score (doesn't matter which player did it))
        for (var i = 0; i < Snake.ALL_SNAKES.length; i++) {
            HighScore.add(MAP_NAME, Snake.ALL_SNAKES[i].getNumberOfTails(), TIMER.getString());
        }
        HighScore.save();
    }
    /**
     * Exit the game immediately.
     * The scores are still saved.
     */
    function quit() {
        addScores();
        Game.clear();
        MainMenu.open();
    }
    Game.quit = quit;
    function clear() {
        for (var i = 0; i < INTERVALS.length; i++) {
            INTERVALS[i].stop();
        }
        INTERVALS.length = 0;
        TIMER.stop();
        Snake.removeAll();
        Wall.removeAll();
        Food.removeAll();
        GameMenu.clear();
        clearCanvas();
        resume();
    }
    Game.clear = clear;
    function pauseResume(pauseGame) {
        if (pauseGame) {
            TIMER.stop();
            for (var i = 0; i < INTERVALS.length; i++) {
                INTERVALS[i].stop();
            }
            pause();
        }
        else {
            TIMER.start();
            for (var i = 0; i < INTERVALS.length; i++) {
                INTERVALS[i].start();
            }
            resume();
        }
    }
    Game.pauseResume = pauseResume;
    function isTwoPlayersMode() {
        return TWO_PLAYER_MODE;
    }
    Game.isTwoPlayersMode = isTwoPlayersMode;
    function isGameOver() {
        return GAME_OVER;
    }
    Game.isGameOver = isGameOver;
})(Game || (Game = {}));
