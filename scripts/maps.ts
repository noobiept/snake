import * as Options from './options.js';
import Interval from './interval.js';
import Snake from "./snake.js";
import Wall from './wall.js';
import { getRandomInt } from './utilities.js'
import { GridPosition, Grid } from './grid.js';
import { MapName, Direction } from './main.js';


// spawn interval of the walls on the 'random' map type
// different value for each difficulty
const SPAWN_WALL = [ 4000, 3000 ];

/**
 * Setup the map walls (depends on the map type).
 * - `random` : Adds walls randomly in the map.
 * - `stairs` : Stair like walls.
 * - `lines`  : Horizontal lines walls.
 * - `empty`  : No walls added.
 */
export function setupWalls( mapName: MapName, snakes: Snake[], grid: Grid ) {
    if ( mapName === 'random' ) {
        return setupRandomMap( snakes, grid );
    }

    else if ( mapName === 'stairs' ) {
        return setupStairsMap( snakes, grid );
    }

    else if ( mapName === 'lines' ) {
        return setupLinesMap( snakes, grid );
    }
}


/**
 * Add some walls randomly on the map on a set interval.
 */
function setupRandomMap( snakes: Snake[], grid: Grid ) {
    const difficulty = Options.getDifficulty();
    const columns = Options.getColumns();
    const lines = Options.getLines();

    var interval = new Interval( function () {
        var maxWallColumns = Math.round( columns * 0.3 );
        var minWallColumns = Math.round( columns * 0.1 );
        var maxWallLines = Math.round( lines * 0.3 );
        var minWallLines = Math.round( lines * 0.1 );

        const totalDirections = Object.keys( Direction ).length / 2;
        const direction = getRandomInt( 0, totalDirections - 1 ) as Direction;

        // don't add wall elements to close to a snake
        const exclude = [];
        const margin = 5;

        for ( let a = 0; a < snakes.length; a++ ) {
            const snake = snakes[ a ];
            const first = snake.first_tail;
            const position = {
                column: Math.round( first.position.column - margin / 2 ),
                line: Math.round( first.position.line - margin / 2 )
            };

            exclude.push( {
                position: position,
                width: margin,
                height: margin
            } );
        }

        const position = grid.getRandomEmptyPosition( exclude );
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

        wallLine( position, length, direction, grid );

    }, SPAWN_WALL[ difficulty ] );

    return interval;
}


/**
 * Add some walls on a 'stair' like layout.
 */
function setupStairsMap( snakes: Snake[], grid: Grid ) {
    const columns = Options.getColumns();
    const lines = Options.getLines();

    const horizontalLength = Math.round( columns * 0.12 );
    const verticalLength = Math.round( lines * 0.09 );
    const steps = 4;
    const horizontalMargin = ( columns - steps * horizontalLength ) / ( steps + 1 );
    const verticalMargin = ( lines - steps * verticalLength ) / ( steps + 1 );

    for ( let a = 0; a < steps; a++ ) {
        const column = Math.round( ( a + 1 ) * horizontalMargin + a * horizontalLength );
        const line = Math.round( ( a + 1 ) * verticalMargin + a * verticalLength );

        const position1 = {
            column: column, line: line
        };
        const position2 = {
            column: column + horizontalLength,
            line: line
        };

        wallLine( position1, horizontalLength, Direction.east, grid );
        wallLine( position2, verticalLength, Direction.south, grid );
    }
}


/**
 * Add some horizontal walls on the map.
 */
function setupLinesMap( snakes: Snake[], grid: Grid ) {
    const linesTotal = 4;
    const columns = Options.getColumns();
    const lines = Options.getLines();
    const length = Math.round( columns * 0.2 ); // of each wall
    const yDiff = lines / ( linesTotal + 1 );

    // there's 3 wall lines in a row, with some margins in between
    // so: (margin)(wall)(margin)(wall)(margin)(wall)(margin)
    const margin = ( columns - 3 * length ) / 4;

    const column1 = margin;
    const column2 = 2 * margin + length;
    const column3 = 3 * margin + 2 * length;

    for ( let a = 0; a < linesTotal; a++ ) {
        const line = yDiff * ( a + 1 );

        wallLine( { column: column1, line: line }, length, Direction.east, grid );
        wallLine( { column: column2, line: line }, length, Direction.east, grid );
        wallLine( { column: column3, line: line }, length, Direction.east, grid );
    }
}


/**
 * Add a line of 'Wall' elements in the given direction.
 */
function wallLine( position: GridPosition, length: number, direction: Direction, grid: Grid ) {
    let addColumn = 0;
    let addLine = 0;

    switch ( direction ) {
        case Direction.north:
            addLine = -1;
            break;

        case Direction.south:
            addLine = 1;
            break;

        case Direction.west:
            addColumn = -1;
            break;

        case Direction.east:
            addColumn = 1;
            break;

        case Direction.northWest:
            addColumn = -1;
            addLine = -1;
            break;

        case Direction.northEast:
            addColumn = 1;
            addLine = -1;
            break;

        default:
            throw Error( 'Invalid direction.' )
    }

    let elementPosition = { ...position };

    for ( let a = 0; a < length; a++ ) {
        // don't add on top of non-empty positions
        if ( grid.isValid( elementPosition ) && grid.isEmpty( elementPosition ) ) {
            const wall = new Wall();
            grid.add( wall, elementPosition );
        }

        elementPosition = {
            column: elementPosition.column + addColumn,
            line: elementPosition.line + addLine
        };
    }
}
