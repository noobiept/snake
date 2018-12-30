import * as GameMenu from './game_menu.js';
import * as Options from '../storage/options.js';
import * as HighScore from '../storage/high_score.js';
import * as MainMenu from '../menu/main_menu.js';
import Snake from './snake.js';
import Wall from './wall.js';
import Food from './food.js';
import DoubleFood from './double_food.js';
import Timer from '../other/timer.js';
import Interval from '../other/interval.js';
import Tail from "./tail.js";
import PopupWindow from "../other/popup_window.js";
import { MapName, Direction, STAGE } from '../main.js';
import { EVENT_KEY } from '../other/utilities.js';
import { Grid, GridItem, ItemType } from "./grid.js";
import { setupWalls } from './maps.js';


interface TickEvent {
    target: Object;
    type: string;
    paused: boolean;
    delta: number;  // time elapsed in ms since the last tick
    time: number;   // total time in ms since 'Ticker' was initialized
    runTime: number;
}

export interface CollisionElements {
    a: GridItem;
    b: GridItem;
}


const INTERVALS: Interval[] = [];
const COLLISIONS: CollisionElements[] = [];

var TIMER: Timer;
var TWO_PLAYER_MODE = false;
var MAP_NAME: MapName;
var GAME_OVER = false;
var PAUSE = false;
export var GRID: Grid;

// the colors are positioned according to the player position as well (player 1 is green, etc)
const SNAKES: Snake[] = [];
const SNAKES_COLORS = [
    'green',
    'dodgerblue'
];


window.onkeydown = function ( event ) {
    var returnValue;

    for ( var i = 0; i < SNAKES.length; i++ ) {
        returnValue = SNAKES[ i ].onKeyDown( event.keyCode );

        if ( !returnValue ) {
            return returnValue;
        }
    }

    return true;
};


window.onkeyup = function ( event ) {
    var returnValue;

    for ( var i = 0; i < SNAKES.length; i++ ) {
        returnValue = SNAKES[ i ].onKeyUp( event.keyCode );

        if ( !returnValue ) {
            return returnValue;
        }
    }

    return true;
};


export function init() {
    TIMER = new Timer( GameMenu.updateTimer );
    createjs.Ticker.on( 'tick', tick as ( event: Object ) => void );    // casting 'event' to 'Object' to fix typing issue
}


export function start( mapName: MapName, twoPlayersMode?: boolean ) {
    if ( typeof twoPlayersMode == 'undefined' ) {
        twoPlayersMode = false;
    }

    GAME_OVER = false;
    TWO_PLAYER_MODE = twoPlayersMode;
    MAP_NAME = mapName;

    TIMER.restart();
    GameMenu.updateTimer( TIMER.getString() );

    const columns = Options.get( 'columns' );
    const lines = Options.get( 'lines' );

    GRID = new Grid( {
        columns: columns,
        lines: lines,
        onCollision: collisionOccurred
    } );

    setupSnakes( twoPlayersMode );
    setupFrame();

    const interval = setupWalls( mapName, SNAKES, GRID );
    if ( interval ) {
        INTERVALS.push( interval );
    }

    setupFoodInterval();
    setupDoubleFoodInterval();
    setupSnakeMovement();

    // update the scores
    for ( let a = 0; a < SNAKES.length; a++ ) {
        const snake = SNAKES[ a ];
        updateScore( snake );
    }

    GameMenu.show( TWO_PLAYER_MODE );
}


function setupSnakes( twoPlayersMode: boolean ) {
    const lines = GRID.args.lines;
    const columns = GRID.args.columns;

    // position the snakes on opposite sides horizontally, and vertically aligned
    const midLine = Math.round( lines / 2 );
    const leftColumn = Math.round( columns * 0.1 );
    const rightColumn = Math.round( columns * 0.9 );

    // player 1 : wasd
    // player 2 : arrow keys
    if ( twoPlayersMode ) {
        // 1 player (on left side of canvas, moving to the right)
        const position1 = 0;
        const snake1 = new Snake( {
            position: {
                column: leftColumn,
                line: midLine
            },
            startingDirection: Direction.east,
            color: SNAKES_COLORS[ position1 ],
            keyboardMapping: {
                left: EVENT_KEY.a,
                right: EVENT_KEY.d,
                up: EVENT_KEY.w,
                down: EVENT_KEY.s
            }
        } );

        // 2 player (on right side of canvas, moving to the left)
        const position2 = 1;
        const snake2 = new Snake( {
            position: {
                column: rightColumn,
                line: midLine
            },
            startingDirection: Direction.west,
            color: SNAKES_COLORS[ position2 ],
            keyboardMapping: {
                left: EVENT_KEY.leftArrow,
                right: EVENT_KEY.rightArrow,
                up: EVENT_KEY.upArrow,
                down: EVENT_KEY.downArrow
            }
        } );

        SNAKES.push( snake1 );
        SNAKES.push( snake2 );
    }

    // player 1 : wasd or arrow keys
    else {
        // 1 player (on left side of canvas, moving to the right)
        const position = 0;
        const snake = new Snake( {
            position: {
                column: leftColumn,
                line: midLine
            },
            startingDirection: Direction.east,
            color: SNAKES_COLORS[ position ],
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
        } );

        SNAKES.push( snake );
    }
}


/**
 * Add a wall around the canvas (so that you can't pass through from one side to the other).
 */
function setupFrame() {
    const lines = GRID.args.lines;
    const columns = GRID.args.columns;

    if ( Options.get( 'frameOn' ) ) {

        // left/right sides
        for ( let line = 0; line < lines; line++ ) {
            const leftWall = new Wall();
            const rightWall = new Wall();

            GRID.add( leftWall, {
                column: 0,
                line: line
            } );
            GRID.add( rightWall, {
                column: columns - 1,
                line: line
            } );
        }

        // top/bottom sides
        // the first/last items were already added above
        for ( let column = 1; column < columns - 1; column++ ) {
            const topWall = new Wall();
            const bottomWall = new Wall();

            GRID.add( topWall, {
                column: column,
                line: 0
            } );
            GRID.add( bottomWall, {
                column: column,
                line: lines - 1
            } );
        }
    }
}


function setupFoodInterval() {
    const foodInterval = Options.get( 'foodInterval' );

    // add food interval
    const interval = new Interval( function () {

        const position = GRID.getRandomEmptyPosition();
        const food = new Food();
        GRID.add( food, position );

    }, foodInterval );
    INTERVALS.push( interval );
}


function setupDoubleFoodInterval() {
    const doubleFoodInterval = Options.get( 'doubleFoodInterval' );

    // add double food
    const interval = new Interval( function () {

        const position = GRID.getRandomEmptyPosition();
        const food = new DoubleFood();
        GRID.add( food, position );

    }, doubleFoodInterval );
    INTERVALS.push( interval );
}


function setupSnakeMovement() {
    const snakeSpeed = Options.get( 'snakeSpeed' );
    const snakeInterval = 1 / snakeSpeed * 1000;

    // setup the snake movement
    const interval = new Interval( function () {
        for ( let i = 0; i < SNAKES.length; i++ ) {
            const snakeObject = SNAKES[ i ];
            snakeObject.movementTick();

            const tails = snakeObject.all_tails;

            for ( let b = 0; b < tails.length; b++ ) {
                const tail = tails[ b ];
                tail.tick();

                const next = tail.nextPosition();
                GRID.move( tail, next );
            }
        }
    }, snakeInterval );
    INTERVALS.push( interval );
}


/**
 * Update the score based on the tail size of the snake.
 */
function updateScore( snake: Snake ) {
    GameMenu.updateScore( SNAKES.indexOf( snake ), snake.all_tails.length );
}


/**
 * When a 'Tail' collides with a 'Food' element, we increase the snake size and remove the 'Food' element.
 */
function tailFoodCollision( tail: Tail, food: Food ) {

    // get the snake object based on the tail color
    const color = tail.color;
    const position = SNAKES_COLORS.indexOf( color );

    if ( position < 0 ) {
        throw Error( 'Invalid tail color.' );
    }

    const snake = SNAKES[ position ];
    snake.eat( food );
    GRID.remove( food );

    updateScore( snake );
}


/**
 * A collision between two 'Tail' elements. The game ends when that happens.
 */
function tailTailCollision( tail1: Tail, tail2: Tail ) {
    tail1.asBeenHit();
    tail2.asBeenHit();

    over();
}


/**
 * A collision between a 'Tail' and a 'Wall' element. Game ends here as well.
 */
function tailWallCollision( tail: Tail, wall: Wall ) {
    tail.asBeenHit();
    wall.asBeenHit();

    over();
}


/**
 * Deal with the collision between 2 elements in the grid.
 * Need to first identify the type and then call the appropriate function.
 */
function dealWithCollision( items: CollisionElements ) {
    const a = items.a;
    const b = items.b;
    const typeA = a.type;
    const typeB = b.type;

    if ( typeA === ItemType.tail && typeB === ItemType.food ) {
        tailFoodCollision( a as Tail, b as Food );
    }

    else if ( typeA === ItemType.food && typeB === ItemType.tail ) {
        tailFoodCollision( b as Tail, a as Food );
    }

    else if ( typeA === ItemType.tail && typeB === ItemType.doubleFood ) {
        tailFoodCollision( a as Tail, b as DoubleFood );
    }

    else if ( typeA === ItemType.doubleFood && typeB === ItemType.tail ) {
        tailFoodCollision( b as Tail, a as DoubleFood );
    }

    else if ( typeA === ItemType.tail && typeB === ItemType.tail ) {
        tailTailCollision( a as Tail, b as Tail );
    }

    else if ( typeA === ItemType.tail && typeB === ItemType.wall ) {
        tailWallCollision( a as Tail, b as Wall );
    }

    else if ( typeA === ItemType.wall && typeB === ItemType.tail ) {
        tailWallCollision( b as Tail, a as Wall );
    }
}


/**
 * Add the pair that collided to be processed later on.
 */
function collisionOccurred( items: CollisionElements ) {
    COLLISIONS.push( items );
}


/**
 * Game is over (happens when the snake hits its tails for example).
 */
export function over() {
    GAME_OVER = true;

    // construct the display message
    let text = 'Game Over!<br />';
    let score = 0;

    if ( TWO_PLAYER_MODE ) {

        var player1_score = SNAKES[ 0 ].getNumberOfTails();
        var player2_score = SNAKES[ 1 ].getNumberOfTails();

        if ( player1_score > player2_score ) {
            text += 'Player 1 Won!<br />';
            score = player1_score;
        }

        else if ( player2_score > player1_score ) {
            text += 'Player 2 Won!<br />';
            score = player2_score;
        }

        else {
            text += 'Draw!<br />';
            score = player1_score;
        }
    }

    else {
        score = SNAKES[ 0 ].getNumberOfTails();
    }

    text += `Score: <span class="displayValue">${score}</span>`;

    pause();
    addScores();

    const popup = new PopupWindow( {
        content: text,
        buttons: [
            {
                text: 'Restart',
                onClick: function () {
                    popup.remove();
                    clear();
                    start( MAP_NAME, TWO_PLAYER_MODE );
                }
            },
            {
                text: 'Quit',
                onClick: function () {
                    popup.remove();
                    quit();
                }
            }
        ]
    } );
};


/**
 * Add the current scores of both players to the high-score (score will be considered if its higher than the current ones).
 */
function addScores() {
    TIMER.stop();

    // add the scores from all the snakes (the high-score is an overall score (doesn't matter which player did it))
    for ( var i = 0; i < SNAKES.length; i++ ) {
        HighScore.add( MAP_NAME, SNAKES[ i ].getNumberOfTails(), TIMER.getMilliseconds() );
    }

    HighScore.save();
}


/**
 * Exit the game immediately.
 * The scores are still saved.
 */
export function quit() {
    addScores();

    clear();
    MainMenu.open( 'mainMenu' );
}


function pause() {
    PAUSE = true;
}


function resume() {
    PAUSE = false;
}


export function isPaused() {
    return PAUSE;
}


/**
 * Clear the game data.
 */
export function clear() {
    INTERVALS.length = 0;
    COLLISIONS.length = 0;
    SNAKES.length = 0;

    TIMER.stop();
    GRID.removeAll();
    GameMenu.clear();
    resume();
}


export function pauseResume( pauseGame: boolean ) {
    if ( pauseGame ) {
        TIMER.stop();
        pause();
    }

    // resume
    else {
        TIMER.start();
        resume();
    }
}


export function isTwoPlayersMode() {
    return TWO_PLAYER_MODE;
}


export function isGameOver() {
    return GAME_OVER;
}



/**
 * Update the game (gets called at every tick).
 */
function tick( event: TickEvent ) {
    if ( PAUSE ) {
        return;
    }

    const delta = event.delta;  // in milliseconds

    // run all the intervals (spawn of food, tail movement, etc)
    for ( let a = 0; a < INTERVALS.length; a++ ) {
        const interval = INTERVALS[ a ];
        interval.tick( delta );
    }

    // deal with all the occurred collisions then reset the array
    for ( let a = 0; a < COLLISIONS.length; a++ ) {
        const items = COLLISIONS[ a ];
        dealWithCollision( items );
    }
    COLLISIONS.length = 0;

    // update the timer
    TIMER.tick( delta );

    // draw stuff to the canvas
    STAGE.update();
}
