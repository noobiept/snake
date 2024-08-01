import * as GameMenu from "./game_menu.js";
import * as Options from "../storage/options.js";
import * as HighScore from "../storage/high_score.js";
import * as MainMenu from "../menu/main_menu.js";
import Snake from "./snake.js";
import Wall from "./wall.js";
import Food from "./food.js";
import Timer from "../other/timer.js";
import Interval from "../other/interval.js";
import Tail from "./tail.js";
import PopupWindow from "../other/popup_window.js";
import Timeout, { TimeoutArgs } from "../other/timeout.js";
import { Grid, GridItem, ItemType, GridPosition } from "./grid.js";
import { setupWalls } from "./maps.js";
import { Apple, Orange, Banana } from "./all_foods.js";
import { showHideCanvas } from "./canvas.js";
import { Direction, type MapName } from "../types.js";

interface TickEvent {
    target: object;
    type: string;
    paused: boolean;
    delta: number; // time elapsed in ms since the last tick
    time: number; // total time in ms since 'Ticker' was initialized
    runTime: number;
}

export interface CollisionElements {
    a: GridItem;
    b: GridItem;
}

const TIMEOUTS: Timeout[] = [];
const INTERVALS: Interval[] = [];
const COLLISIONS: CollisionElements[] = [];

let TIMER: Timer;
let TWO_PLAYER_MODE = false;
let MAP_NAME: MapName;
let GAME_OVER = false;
let PAUSE = false;
let STAGE: createjs.Stage;
let GRID: Grid;

// the colors are positioned according to the player position as well (player 1 is green, etc)
const SNAKES: Snake[] = [];
const SNAKES_COLORS = ["green", "dodgerblue"];

/**
 * Deal with the keyboard inputs (used to control the snakes, etc).
 */
window.onkeydown = function (event) {
    for (let i = 0; i < SNAKES.length; i++) {
        const returnValue = SNAKES[i].onKeyDown(event.code);

        if (!returnValue) {
            return returnValue;
        }
    }

    return true;
};

/**
 * Deal with the keyboard inputs (used to control the snakes, etc).
 */
window.onkeyup = function (event) {
    for (let i = 0; i < SNAKES.length; i++) {
        const returnValue = SNAKES[i].onKeyUp(event.code);

        if (!returnValue) {
            return returnValue;
        }
    }

    return true;
};

/**
 * Initialize some game related functionality (the timer, ticker, etc)
 */
export function init(canvas: HTMLCanvasElement) {
    GameMenu.init({
        onQuit: () => {
            // don't allow to mess with the menu when game is over
            if (isGameOver()) {
                return;
            }

            quit();
        },
        togglePause: () => {
            const currentState = isPaused();

            // don't allow to mess with the menu when game is over
            if (isGameOver()) {
                return currentState;
            }

            const nextState = !currentState;
            pauseResume(nextState);

            return nextState;
        },
    });

    TIMER = new Timer(GameMenu.updateTimer);
    createjs.Ticker.on("tick", tick as (event: object) => void); // casting 'event' to 'Object' to fix typing issue
    STAGE = new createjs.Stage(canvas);
}

/**
 * Start a new game.
 */
export function start(mapName: MapName, twoPlayersMode?: boolean) {
    if (typeof twoPlayersMode == "undefined") {
        twoPlayersMode = false;
    }

    GAME_OVER = false;
    TWO_PLAYER_MODE = twoPlayersMode;
    MAP_NAME = mapName;

    TIMER.restart();
    GameMenu.updateTimer(TIMER.getString());

    const columns = Options.get("columns");
    const lines = Options.get("lines");

    GRID = new Grid({
        columns: columns,
        lines: lines,
        onCollision: collisionOccurred,
        onAdd: addToStage,
        onRemove: removeFromStage,
    });

    setupSnakes(twoPlayersMode);
    setupFrame();

    const interval = setupWalls(mapName, SNAKES, GRID);
    if (interval) {
        INTERVALS.push(interval);
    }

    setupAppleInterval();
    setupOrangeInterval();
    setupBananaInterval();
    setupSnakeMovement();

    // update the scores
    for (let a = 0; a < SNAKES.length; a++) {
        const snake = SNAKES[a];
        updateScore(snake);
    }

    showHideCanvas(true);
    GameMenu.show(TWO_PLAYER_MODE);
}

/**
 * Add the snake objects.
 */
function setupSnakes(twoPlayersMode: boolean) {
    const lines = GRID.args.lines;
    const columns = GRID.args.columns;
    const snakeSpeed = Options.get("snakeSpeed");

    // position the snakes on opposite sides horizontally, and vertically aligned
    const midLine = Math.round(lines / 2);
    const leftColumn = Math.round(columns * 0.1);
    const rightColumn = Math.round(columns * 0.9);

    // player 1 : wasd
    // player 2 : arrow keys
    if (twoPlayersMode) {
        // 1 player (on left side of canvas, moving to the right)
        const position1 = 0;
        const snake1 = new Snake({
            speed: snakeSpeed,
            position: {
                column: leftColumn,
                line: midLine,
            },
            startingDirection: Direction.east,
            color: SNAKES_COLORS[position1],
            keyboardMapping: {
                left: "KeyA",
                right: "KeyD",
                up: "KeyW",
                down: "KeyS",
            },
            onAdd: addToStage,
            onRemove: removeFromStage,
        });

        // 2 player (on right side of canvas, moving to the left)
        const position2 = 1;
        const snake2 = new Snake({
            speed: snakeSpeed,
            position: {
                column: rightColumn,
                line: midLine,
            },
            startingDirection: Direction.west,
            color: SNAKES_COLORS[position2],
            keyboardMapping: {
                left: "ArrowLeft",
                right: "ArrowRight",
                up: "ArrowUp",
                down: "ArrowDown",
            },
            onAdd: addToStage,
            onRemove: removeFromStage,
        });

        SNAKES.push(snake1);
        SNAKES.push(snake2);
    }

    // player 1 : 'wasd' or arrow keys
    else {
        // 1 player (on left side of canvas, moving to the right)
        const position = 0;
        const snake = new Snake({
            speed: snakeSpeed,
            position: {
                column: leftColumn,
                line: midLine,
            },
            startingDirection: Direction.east,
            color: SNAKES_COLORS[position],
            keyboardMapping: {
                left: "KeyA",
                left2: "ArrowLeft",
                right: "KeyD",
                right2: "ArrowRight",
                up: "KeyW",
                up2: "ArrowUp",
                down: "KeyS",
                down2: "ArrowDown",
            },
            onAdd: addToStage,
            onRemove: removeFromStage,
        });

        SNAKES.push(snake);
    }
}

/**
 * Add a wall around the canvas (so that you can't pass through from one side to the other).
 */
function setupFrame() {
    const lines = GRID.args.lines;
    const columns = GRID.args.columns;

    if (Options.get("frameOn")) {
        // left/right sides
        for (let line = 0; line < lines; line++) {
            const leftWall = new Wall();
            const rightWall = new Wall();

            GRID.add(leftWall, {
                column: 0,
                line: line,
            });
            GRID.add(rightWall, {
                column: columns - 1,
                line: line,
            });
        }

        // top/bottom sides
        // the first/last items were already added above
        for (let column = 1; column < columns - 1; column++) {
            const topWall = new Wall();
            const bottomWall = new Wall();

            GRID.add(topWall, {
                column: column,
                line: 0,
            });
            GRID.add(bottomWall, {
                column: column,
                line: lines - 1,
            });
        }
    }
}

/**
 * Add new 'Apple' elements at a certain interval.
 */
function setupAppleInterval() {
    const appleInterval = Options.get("appleInterval");

    // add apple interval
    const interval = new Interval({
        callback: function () {
            const position = GRID.getRandomEmptyPosition();
            const food = new Apple();
            GRID.add(food, position);
        },
        interval: appleInterval,
    });
    INTERVALS.push(interval);
}

/**
 * Add new 'Orange' elements at a certain interval.
 */
function setupOrangeInterval() {
    const orangeInterval = Options.get("orangeInterval");

    // add orange interval
    const interval = new Interval({
        callback: function () {
            const position = GRID.getRandomEmptyPosition();
            const food = new Orange();
            GRID.add(food, position);
        },
        interval: orangeInterval,
    });
    INTERVALS.push(interval);
}

/**
 * Add new 'Banana' elements at a certain interval.
 */
function setupBananaInterval() {
    const bananaInterval = Options.get("bananaInterval");

    const interval = new Interval({
        callback: function () {
            const position = GRID.getRandomEmptyPosition();
            const food = new Banana();
            GRID.add(food, position);
        },
        interval: bananaInterval,
    });
    INTERVALS.push(interval);
}

/**
 * The snake is moved depending on the speed that was set on the options.
 */
function setupSnakeMovement() {
    // setup the snake movement
    for (let a = 0; a < SNAKES.length; a++) {
        const snake = SNAKES[a];
        const snakeInterval = () => {
            return snake.getMovementInterval();
        };

        const interval = new Interval({
            callback: () => {
                snake.movementTick();

                const tails = snake.getAllTails();

                for (let b = 0; b < tails.length; b++) {
                    const tail = tails[b];
                    tail.tick();

                    const next = tail.nextPosition();
                    GRID.move(tail, next);
                }
            },
            interval: snakeInterval,
        });
        INTERVALS.push(interval);
    }
}

/**
 * Update the score based on the tail size of the snake.
 */
function updateScore(snake: Snake) {
    GameMenu.updateScore(SNAKES.indexOf(snake), snake.getAllTails().length);
}

/**
 * When a 'Tail' collides with a 'Food' element, we increase the snake size and remove the 'Food' element.
 */
function tailFoodCollision(tail: Tail, food: Food) {
    // get the snake object based on the tail color
    const color = tail.color;
    const position = SNAKES_COLORS.indexOf(color);

    if (position < 0) {
        throw Error("Invalid tail color.");
    }

    const snake = SNAKES[position];
    snake.eat(food);
    GRID.remove(food);

    updateScore(snake);
}

/**
 * A collision between two 'Tail' elements. The game ends when that happens.
 */
function tailTailCollision(tail1: Tail, tail2: Tail) {
    tail1.asBeenHit();
    tail2.asBeenHit();

    over();
}

/**
 * A collision between a 'Tail' and a 'Wall' element. Game ends here as well.
 */
function tailWallCollision(tail: Tail, wall: Wall) {
    tail.asBeenHit();
    wall.asBeenHit();

    over();
}

/**
 * Deal with the collision between 2 elements in the grid.
 * Need to first identify the type and then call the appropriate function.
 */
function dealWithCollision(items: CollisionElements) {
    if (GAME_OVER) {
        return;
    }

    const a = items.a;
    const b = items.b;
    const typeA = a.type;
    const typeB = b.type;

    if (typeA === ItemType.tail && typeB === ItemType.food) {
        tailFoodCollision(a as Tail, b as Food);
    } else if (typeA === ItemType.food && typeB === ItemType.tail) {
        tailFoodCollision(b as Tail, a as Food);
    } else if (typeA === ItemType.tail && typeB === ItemType.tail) {
        tailTailCollision(a as Tail, b as Tail);
    } else if (typeA === ItemType.tail && typeB === ItemType.wall) {
        tailWallCollision(a as Tail, b as Wall);
    } else if (typeA === ItemType.wall && typeB === ItemType.tail) {
        tailWallCollision(b as Tail, a as Wall);
    }
}

/**
 * Add the pair that collided to be processed later on.
 */
function collisionOccurred(items: CollisionElements) {
    COLLISIONS.push(items);
}

/**
 * Game is over (happens when the snake hits its tails for example).
 */
export function over() {
    if (GAME_OVER) {
        return;
    }

    GAME_OVER = true;

    // construct the display message
    let text = "Game Over!<br />";
    let score = 0;

    if (TWO_PLAYER_MODE) {
        const player1_score = SNAKES[0].getNumberOfTails();
        const player2_score = SNAKES[1].getNumberOfTails();

        if (player1_score > player2_score) {
            text += "Player 1 Won!<br />";
            score = player1_score;
        } else if (player2_score > player1_score) {
            text += "Player 2 Won!<br />";
            score = player2_score;
        } else {
            text += "Draw!<br />";
            score = player1_score;
        }
    } else {
        score = SNAKES[0].getNumberOfTails();
    }

    text += `Score: <span class="displayValue">${score}</span>`;

    pause();
    addScores();

    const popup = new PopupWindow({
        content: text,
        buttons: [
            {
                text: "Restart",
                onClick: function () {
                    popup.remove();
                    clear();
                    start(MAP_NAME, TWO_PLAYER_MODE);
                },
            },
            {
                text: "Quit",
                onClick: function () {
                    popup.remove();
                    quit(false); // scores were already saved above
                },
            },
        ],
    });
}

/**
 * Add the current scores of both players to the high-score (score will be considered if its higher than the current ones).
 */
function addScores() {
    TIMER.stop();

    // add the scores from all the snakes (the high-score is an overall score (doesn't matter which player did it))
    for (let i = 0; i < SNAKES.length; i++) {
        HighScore.add(
            MAP_NAME,
            SNAKES[i].getNumberOfTails(),
            TIMER.getMilliseconds()
        );
    }

    HighScore.save();
}

/**
 * Exit the game immediately.
 * The scores are still saved.
 */
export function quit(saveScores = true) {
    if (saveScores) {
        addScores();
    }

    clear();
    showHideCanvas(false);
    MainMenu.open("mainMenu");
}

/**
 * Pause the game.
 */
function pause() {
    PAUSE = true;
}

/**
 * Resume the game.
 */
function resume() {
    PAUSE = false;
}

/**
 * Check if the game is paused or not.
 */
export function isPaused() {
    return PAUSE;
}

/**
 * Clear the game data.
 */
export function clear() {
    TIMEOUTS.length = 0;
    INTERVALS.length = 0;
    COLLISIONS.length = 0;
    SNAKES.length = 0;

    TIMER.stop();
    GRID.removeAll();
    GameMenu.clear();
    resume();
}

/**
 * Pause or resume the game.
 */
export function pauseResume(pauseGame: boolean) {
    if (pauseGame) {
        TIMER.stop();
        pause();
    }

    // resume
    else {
        TIMER.start();
        resume();
    }
}

/**
 * Check if the current game has 2 players.
 */
export function isTwoPlayersMode() {
    return TWO_PLAYER_MODE;
}

/**
 * Has the game ended (for example when a snake hits a tail, etc).
 */
export function isGameOver() {
    return GAME_OVER;
}

/**
 * Add a shape to the stage (so it can be drawn).
 */
function addToStage(item: GridItem) {
    STAGE.addChild(item.shape);
}

/**
 * Remove a shape from the stage.
 */
function removeFromStage(item: GridItem) {
    STAGE.removeChild(item.shape);
}

/**
 * Add an element to the grid at the given position.
 * The desired position might not be where it ends up being placed (when trying to add in a position outside of the grid).
 */
export function addToGrid(element: GridItem, desiredPosition: GridPosition) {
    const position = GRID.getValidPosition(desiredPosition);

    GRID.add(element, position);
}

/**
 * Add a new timeout to the game loop (so its able to count the time).
 */
export function addTimeout(args: TimeoutArgs) {
    const timeout = new Timeout(args);
    TIMEOUTS.push(timeout);
}

/**
 * Update the game (gets called at every tick).
 */
function tick(event: TickEvent) {
    if (PAUSE) {
        return;
    }

    const delta = event.delta; // in milliseconds

    // run all the timeouts
    for (let a = TIMEOUTS.length - 1; a >= 0; a--) {
        const timeout = TIMEOUTS[a];
        const over = timeout.tick(delta);

        if (over) {
            TIMEOUTS.splice(a, 1);
        }
    }

    // run all the intervals (spawn of food, tail movement, etc)
    for (let a = 0; a < INTERVALS.length; a++) {
        const interval = INTERVALS[a];
        interval.tick(delta);
    }

    // deal with all the occurred collisions then reset the array
    for (let a = 0; a < COLLISIONS.length; a++) {
        const items = COLLISIONS[a];
        dealWithCollision(items);
    }
    COLLISIONS.length = 0;

    // update the timer
    TIMER.tick(delta);

    // draw stuff to the canvas
    STAGE.update();
}
