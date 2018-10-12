import * as GameMenu from './game_menu.js';
import * as Options from './options.js';
import * as HighScore from './high_score.js';
import * as MainMenu from './main_menu.js';
import Snake from './snake.js';
import Wall from './wall.js';
import Food from './food.js';
import DoubleFood from './double_food.js';
import Message from './message.js';
import Timer from './timer.js';
import Interval from './interval.js';
import { MapName, Direction, STAGE } from './main.js';
import { EVENT_KEY, getRandomInt } from './utilities.js';
import { Grid, GridItem, ItemType, GridPosition } from "./grid.js";
import Tail from "./tail.js";


interface TickEvent {
    target: Object;
    type: string;
    paused: boolean;
    delta: number;  // time elapsed in ms since the last tick
    time: number;   // total time in ms since 'Ticker' was initialized
    runTime: number;
}


const INTERVALS: Interval[] = [];

// the time until we add a new food/wall/etc (in milliseconds)
// depends on the difficulty level
// the order matters (get the difficulty from Options, which will be the position in this)
const SNAKE_SPEED = [ 100, 50 ];
const SPAWN_FOOD = [ 1000, 500 ];
const SPAWN_DOUBLE_FOOD = [ 5000, 2500 ];
const SPAWN_WALL = [ 4000, 3000 ];

var TIMER: Timer;
var TWO_PLAYER_MODE = false;
var MAP_NAME: MapName;
var GAME_OVER = false;
var PAUSE = false;
export var GRID: Grid;

const SNAKES: Snake[] = [];


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

    var difficulty = Options.getDifficulty();
    const columns = Options.getColumns();
    const lines = Options.getLines();

    GRID = new Grid( {
        columns: columns,
        lines: lines,
        onCollision: collisionDetection
    } );

    // position the snakes on opposite sides horizontally, and vertically aligned
    const midLine = Math.round( lines / 2 );
    const leftColumn = Math.round( columns * 0.1 );
    const rightColumn = Math.round( columns * 0.9 );

    // player 1 : wasd
    // player 2 : arrow keys
    if ( twoPlayersMode ) {
        // 1 player (on left side of canvas, moving to the right)
        const snake1 = new Snake( {
            position: {
                column: leftColumn,
                line: midLine
            },
            startingDirection: Direction.right,
            color: 'green',
            keyboardMapping: {
                left: EVENT_KEY.a,
                right: EVENT_KEY.d,
                up: EVENT_KEY.w,
                down: EVENT_KEY.s
            }
        } );

        // 2 player (on right side of canvas, moving to the left)
        const snake2 = new Snake( {
            position: {
                column: rightColumn,
                line: midLine
            },
            startingDirection: Direction.left,
            color: 'dodgerblue',
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
        const snake = new Snake( {
            position: {
                column: leftColumn,
                line: midLine
            },
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
        } );

        SNAKES.push( snake );
    }

    // add a wall around the canvas (so that you can't pass through from one side to the other)
    if ( Options.getFrame() ) {

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

    // add the map walls (its different depending on the selected map)
    setupWalls( mapName );

    // add food interval
    let interval = new Interval( function () {

        // the grid allows multiple items to be on the same position, so just get a random position, even if it ends up on top of another element
        const position = {
            column: getRandomInt( 0, columns - 1 ),
            line: getRandomInt( 0, lines - 1 )
        };

        const food = new Food();
        GRID.add( food, position );

    }, SPAWN_FOOD[ difficulty ] );
    INTERVALS.push( interval );

    // add double food
    interval = new Interval( function () {

        // the grid allows multiple items to be on the same position, so just get a random position, even if it ends up on top of another element
        const position = {
            column: getRandomInt( 0, columns - 1 ),
            line: getRandomInt( 0, lines - 1 )
        };

        const food = new DoubleFood();
        GRID.add( food, position );

    }, SPAWN_DOUBLE_FOOD[ difficulty ] );
    INTERVALS.push( interval );

    // setup the snake movement
    interval = new Interval( function () {
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
    }, SNAKE_SPEED[ difficulty ] );
    INTERVALS.push( interval );

    GameMenu.show( TWO_PLAYER_MODE );
}


/**
 * When a 'Tail' collides with a 'Food' element, we increase the snake size and remove the 'Food' element.
 */
function tailFoodCollision( tail: Tail, food: Food ) {

    tail.snakeObject.eat( food );
    GRID.remove( food );
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
function collisionDetection( a: GridItem, b: GridItem ) {
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

    console.log( ItemType[ a.type ], ItemType[ b.type ] );
}


/**
 * Setup the map walls (depends on the map type).
 * - `random` : Adds walls randomly in the map.
 * - `stairs` : Stair like walls.
 * - `lines`  : Horizontal lines walls.
 * - `empty`  : No walls added.
 */
function setupWalls( mapName: MapName ) {
    const difficulty = Options.getDifficulty();
    const columns = Options.getColumns();
    const lines = Options.getLines();

    // randomly add walls in the map
    if ( mapName === 'random' ) {
        var interval = new Interval( function () {
            var maxWallColumns = Math.round( columns * 0.2 );
            var minWallColumns = Math.round( columns * 0.1 );
            var maxWallLines = Math.round( lines * 0.2 );
            var minWallLines = Math.round( lines * 0.1 );

            const totalDirections = Object.keys( Direction ).length / 2;
            const direction = getRandomInt( 0, totalDirections - 1 ) as Direction;

            const position = {
                column: getRandomInt( 0, columns ),
                line: getRandomInt( 0, lines )
            };
            let length = 1;

            if ( direction ) {
                length = getRandomInt( minWallLines, maxWallLines );
            }

            else {
                length = getRandomInt( minWallColumns, maxWallColumns );
            }

            // needs at a minimum to occupy one grid position
            if ( length < 1 ) {
                length = 1;
            }

            // we have to make sure it isn't added on top of the snake's tails
            for ( let a = 0; a < SNAKES.length; a++ ) {
                const snake = SNAKES[ a ];

                var margin = 5;
                //HERE
            }

            wallLine( position, length, direction );

        }, SPAWN_WALL[ difficulty ] );
        INTERVALS.push( interval );
    }
    /*
        else if ( mapName === 'stairs' ) {
            var columnLength = Math.round( columns * 0.1 );
            var lineLength = Math.round( lines * 0.06 );
            var steps = 4;
            var columnOffset = columns / ( steps + 1 );
            var lineOffset = lines / ( steps + 1 );

            for ( let a = 0; a < steps; a++ ) {
                var column = ( a + 1 ) * columnOffset;
                var line = ( a + 1 ) * lineOffset;

                const position1 = {
                    column: column, line: line
                };
                const position2 = {
                    column: column + Math.round( columnLength / 2 ),
                    line: line + Math.round( lineLength / 2 )
                }

                const wall1 = new Wall();
                const wall2 = new Wall();

                GRID.add( wall1, position1 );
                GRID.add( wall2, position2 );
            }
        }

        else if ( mapName === 'lines' ) {
            var lines = 4;
            var canvasWidth = Options.getCanvasWidth();
            var canvasHeight = Options.getCanvasHeight();
            var x1 = canvasWidth * 0.15;
            var x2 = canvasWidth * 0.5;
            var x3 = canvasWidth * 0.85;
            var yDiff = canvasHeight / ( lines + 1 );
            var width = canvasWidth * 0.2;
            var height = canvasHeight * 0.01;

            for ( var a = 0; a < lines; a++ ) {
                var line = yDiff * ( a + 1 );

                new Wall( x1, line, width, height );
                new Wall( x2, line, width, height );
                new Wall( x3, line, width, height );
            }
        }*/
}


/**
 * Add a line of 'Wall' elements in the given direction.
 */
function wallLine( position: GridPosition, length: number, direction: Direction ) {
    let addColumn = 0;
    let addLine = 0;

    switch ( direction ) {
        case Direction.up:
            addLine = -1;
            break;

        case Direction.down:
            addLine = 1;
            break;

        case Direction.left:
            addColumn = -1;
            break;

        case Direction.right:
            addColumn = 1;
            break;

        default:
            throw Error( 'Invalid direction.' )
    }

    let elementPosition = { ...position };

    for ( let a = 0; a < length; a++ ) {
        const wall = new Wall();
        GRID.add( wall, elementPosition );

        elementPosition = {
            column: elementPosition.column + addColumn,
            line: elementPosition.line + addLine
        };
    }
}


/*
    When the snake hits its tails for example

    arguments:

        whoWon : if provided, tells which player (1 or 2) won, otherwise check the number of tails (for 2 players only)

 */
export function over( whoWon?: number ) {
    GAME_OVER = true;
    var text = 'Game Over<br />';

    if ( TWO_PLAYER_MODE ) {
        if ( typeof whoWon != 'undefined' ) {
            text += 'Player ' + whoWon + ' Won!';
        }

        else {
            var player1_score = SNAKES[ 0 ].getNumberOfTails();
            var player2_score = SNAKES[ 1 ].getNumberOfTails();

            if ( player1_score > player2_score ) {
                text += 'Player 1 Won!';
            }

            else if ( player2_score > player1_score ) {
                text += 'Player 2 Won!';
            }

            else {
                text += 'Draw!';
            }
        }
    }

    else {
        text = 'Game Over<br />Score: ' + SNAKES[ 0 ].getNumberOfTails();
    }


    var message = new Message( {
        text: text,
        cssClass: 'Message-gameOver'
    } );

    pause();
    addScores();

    window.setTimeout( function () {
        message.remove();
        clear();
        start( MAP_NAME, TWO_PLAYER_MODE );

    }, 2000 );
};


/**
 * Add the current scores of both players to the high-score (score will be considered if its higher than the current ones).
 */
function addScores() {
    TIMER.stop();

    // add the scores from all the snakes (the high-score is an overall score (doesn't matter which player did it))
    for ( var i = 0; i < SNAKES.length; i++ ) {
        HighScore.add( MAP_NAME, SNAKES[ i ].getNumberOfTails(), TIMER.getString() );
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


export function clear() {
    INTERVALS.length = 0;
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

    const delta = event.delta;

    for ( let a = 0; a < INTERVALS.length; a++ ) {
        const interval = INTERVALS[ a ];
        interval.tick( delta );
    }

    TIMER.tick( delta );

    STAGE.update();
}
