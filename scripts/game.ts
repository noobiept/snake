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
import { MapName, Direction, pause, resume, STAGE } from './main.js';
import { EVENT_KEY, getRandomInt, checkOverflowPosition, checkCollision } from './utilities.js';
import { Grid, GridItem, ItemType } from "./grid.js";
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
const SPAWN_FOOD = [ 1000, 2500 ];
const SPAWN_DOUBLE_FOOD = [ 5000, 8000 ];
const SPAWN_WALL = [ 4000, 3000 ];

var TIMER: Timer;
var TWO_PLAYER_MODE = false;
var MAP_NAME: MapName;
var GAME_OVER = false;
export var GRID: Grid;


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
    GameMenu.updateTimer( TIMER );

    var difficulty = Options.getDifficulty();
    const columns = 50;
    const lines = 50;

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
        new Snake( {
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
        new Snake( {
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


    }

    // player 1 : wasd or arrow keys
    else {
        // 1 player (on left side of canvas, moving to the right)
        new Snake( {
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
    }

    /*
        createjs.Ticker.interval = TIME_BETWEEN_TICKS[ difficulty ];

        // add a wall around the canvas (so that you can't pass through from one side to the other)
        if ( Options.getFrame() ) {
            new Wall( 0, canvasHeight / 2, 5, canvasHeight ); // left
            new Wall( canvasWidth / 2, 0, canvasWidth, 5 );   // top
            new Wall( canvasWidth, canvasHeight / 2, 5, canvasHeight ); // right
            new Wall( canvasWidth / 2, canvasHeight, canvasWidth, 5 ); //bottom
        }*///HERE

    //setupWalls( mapName ); //HERE

    // add food interval
    let interval = new Interval( function () {

        // don't add food on top of the walls/etc
        // try 5 times, otherwise just give up
        for ( var i = 0; i < 5; i++ ) {
            const position = {
                column: getRandomInt( 0, columns - 1 ),
                line: getRandomInt( 0, lines - 1 )
            };

            const item = GRID.get( position );

            if ( !item ) {
                const food = new Food();

                GRID.add( food, position );
                break;
            }
        }
    }, SPAWN_FOOD[ difficulty ] );
    INTERVALS.push( interval );

    // add double food
    interval = new Interval( function () {

        // don't add food on top of the walls/etc
        // try 5 times, otherwise just give up
        for ( let i = 0; i < 5; i++ ) {
            const position = {
                column: getRandomInt( 0, columns - 1 ),
                line: getRandomInt( 0, lines - 1 )
            };

            const item = GRID.get( position );

            if ( !item ) {
                const food = new DoubleFood();

                GRID.add( food, position );
                break;
            }
        }
    }, SPAWN_DOUBLE_FOOD[ difficulty ] );
    INTERVALS.push( interval );

    // setup the snake movement
    interval = new Interval( function () {
        for ( let i = 0; i < Snake.ALL_SNAKES.length; i++ ) {
            const snakeObject = Snake.ALL_SNAKES[ i ];
            snakeObject.movementTick();

            const tails = snakeObject.all_tails;

            for ( let b = 0; b < tails.length; b++ ) {
                const tail = tails[ b ];
                tail.tick();

                const current = tail.position;
                const next = tail.nextPosition();

                GRID.move( current, next );
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
    GRID.remove( food.position );
    food.remove();
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

    console.log( ItemType[ a.type ], ItemType[ b.type ] );
    return true;
}


/**
 * Setup the map walls (depends on the map type).
 * - `random` : Adds walls randomly in the map.
 * - `stairs` : Stair like walls.
 * - `lines`  : Horizontal lines walls.
 * - `empty`  : No walls added.
 */
function setupWalls( mapName: MapName ) {
    /*var difficulty = Options.getDifficulty();

    // randomly add walls in the map
    if ( mapName === 'random' ) {
        var interval = new Interval( function () {
            var x = 0, y = 0;
            var width = 0, height = 0;
            var verticalOrientation = 0;
            var canvasWidth = Options.getCanvasWidth();
            var canvasHeight = Options.getCanvasHeight();
            var maxWallWidth = canvasWidth * 0.2;
            var minWallWidth = canvasWidth * 0.1;
            var maxWallHeight = canvasHeight * 0.2;
            var minWallHeight = canvasHeight * 0.1;

            // don't add walls on top of the food (otherwise its impossible to get it)
            // try 5 times, otherwise just use whatever position
            for ( var i = 0; i < 5; i++ ) {
                x = getRandomInt( 0, canvasWidth );
                y = getRandomInt( 0, canvasHeight );
                verticalOrientation = getRandomInt( 0, 1 );

                if ( verticalOrientation ) {
                    width = 10;
                    height = getRandomInt( minWallHeight, maxWallHeight );
                }

                else {
                    width = getRandomInt( minWallWidth, maxWallWidth );
                    height = 10;
                }

                if ( !elementCollision( x, y, width, height, Food.ALL_FOOD ) ) {
                    break;
                }
            }

            // we have to make sure it doesnt add on top of the snake
            //HERE it could still be added on top of the tails?.. isn't as bad since what matters in the collision is the first tail
            // also we could add the wall on top of food (since we're changing the values we checked above)
            for ( i = 0; i < Snake.ALL_SNAKES.length; i++ ) {
                var snakeX = Snake.ALL_SNAKES[ i ].getX();
                var snakeY = Snake.ALL_SNAKES[ i ].getY();

                var margin = 60;

                // means the wall position is close to the snake
                if ( snakeX > x - margin && snakeX < x + margin &&
                    snakeY > y - margin && snakeY < y + margin ) {
                    x += 100;
                    y += 100;

                    // to make sure it doesn't go out of bounds
                    x = checkOverflowPosition( x, canvasWidth );
                    y = checkOverflowPosition( y, canvasHeight );
                }
            }

            new Wall( x, y, width, height );

        }, WALL_TIMINGS[ difficulty ] );
        interval.start();

        INTERVALS.push( interval );
    }

    else if ( mapName === 'stairs' ) {
        var canvasWidth = Options.getCanvasWidth();
        var canvasHeight = Options.getCanvasHeight();
        var width = canvasWidth * 0.1;
        var widthThickness = canvasWidth * 0.01;
        var height = canvasHeight * 0.06;
        var heightThickness = canvasHeight * 0.015;
        var steps = 4;
        var xOffset = canvasWidth / ( steps + 1 );
        var yOffset = canvasHeight / ( steps + 1 );

        for ( var a = 0; a < steps; a++ ) {
            var x = ( a + 1 ) * xOffset;
            var y = ( a + 1 ) * yOffset;

            new Wall( x, y, width, widthThickness );
            new Wall( x + width / 2, y + height / 2, heightThickness, height );
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
            var y = yDiff * ( a + 1 );

            new Wall( x1, y, width, height );
            new Wall( x2, y, width, height );
            new Wall( x3, y, width, height );
        }
    }*/
}


/**
 * Check if a food/wall position is colliding with any of the  walls/foods.
 */
function elementCollision( x: number, y: number, width: number, height: number, elementsArray: Wall[] | Food[] ) {
    for ( var i = 0; i < elementsArray.length; i++ ) {
        var element = elementsArray[ i ];

        if ( checkCollision( x, y, width, height, element.getX(), element.getY(), element.getWidth(), element.getHeight() ) ) {
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
export function over( whoWon?: number ) {
    GAME_OVER = true;
    var text = 'Game Over<br />';

    if ( TWO_PLAYER_MODE ) {
        if ( typeof whoWon != 'undefined' ) {
            text += 'Player ' + whoWon + ' Won!';
        }

        else {
            var player1_score = Snake.ALL_SNAKES[ 0 ].getNumberOfTails();
            var player2_score = Snake.ALL_SNAKES[ 1 ].getNumberOfTails();

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
        text = 'Game Over<br />Score: ' + Snake.ALL_SNAKES[ 0 ].getNumberOfTails();
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
    for ( var i = 0; i < Snake.ALL_SNAKES.length; i++ ) {
        HighScore.add( MAP_NAME, Snake.ALL_SNAKES[ i ].getNumberOfTails(), TIMER.getString() );
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


export function clear() {
    /* for ( var i = 0; i < INTERVALS.length; i++ ) {
         INTERVALS[ i ].stop();
     }
 */
    INTERVALS.length = 0;

    TIMER.stop();

    Snake.removeAll();
    Wall.removeAll();
    Food.removeAll();

    GameMenu.clear();
    resume();
}


export function pauseResume( pauseGame: boolean ) {
    /*if ( pauseGame ) {
        TIMER.stop();

        for ( let i = 0; i < INTERVALS.length; i++ ) {
            INTERVALS[ i ].stop();
        }

        pause();
    }

    // resume
    else {
        TIMER.start();

        for ( let i = 0; i < INTERVALS.length; i++ ) {
            INTERVALS[ i ].start();
        }

        resume();
    }*/
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
    if ( event.paused ) {
        return;
    }

    const delta = event.delta;

    for ( let a = 0; a < INTERVALS.length; a++ ) {
        const interval = INTERVALS[ a ];
        interval.tick( delta );
    }

    STAGE.update();
}
