import * as Options from "../storage/options.js";
import Interval from "../other/interval.js";
import Snake from "./snake.js";
import Wall from "./wall.js";
import { getRandomInt } from "../other/utilities.js";
import { GridPosition, Grid } from "./grid.js";
import { MapName, Direction } from "../main.js";

interface RandomOptions {
    directions: Direction[]; // Randomly select a position from the given list each time.
    length: { percentage: boolean; min: number; max: number }; // Randomly select a value between 'min' and 'max'. This value is either a fixed number of positions or a percentage based on the canvas dimensions.
    spawnInterval: number; // Time in milliseconds between each wall spawn.
}

/**
 * Setup the map walls (depends on the map type).
 * - `random`         : Adds horizontal/vertical walls randomly in the map.
 * - `randomDiagonal` : Add walls in a diagonal direction randomly in the map.
 * - `randomSingle`   : Add single position walls randomly in the map.
 * - `stairs`         : Stair like walls.
 * - `lines`          : Horizontal lines walls.
 * - `empty`          : No walls added.
 */
export function setupWalls(mapName: MapName, snakes: Snake[], grid: Grid) {
    const interval = Options.get("wallInterval");

    switch (mapName) {
        case "random":
            return setupRandomMap(snakes, grid, {
                directions: [
                    Direction.north,
                    Direction.south,
                    Direction.west,
                    Direction.east,
                ],
                length: { percentage: true, min: 0.1, max: 0.3 },
                spawnInterval: interval,
            });
            break;

        case "randomDiagonal":
            return setupRandomMap(snakes, grid, {
                directions: [
                    Direction.northEast,
                    Direction.northWest,
                    Direction.southEast,
                    Direction.southWest,
                ],
                length: { percentage: true, min: 0.1, max: 0.3 },
                spawnInterval: interval,
            });
            break;

        case "randomSingle":
            return setupRandomMap(snakes, grid, {
                directions: [Direction.north],
                length: { percentage: false, min: 1, max: 1 },
                spawnInterval: interval,
            });
            break;

        case "stairs":
            return setupStairsMap(snakes, grid);
            break;

        case "lines":
            return setupLinesMap(snakes, grid);
            break;
    }
}

/**
 * Add some walls randomly on the map on a set interval.
 */
function setupRandomMap(snakes: Snake[], grid: Grid, options: RandomOptions) {
    const columns = Options.get("columns");
    const lines = Options.get("lines");
    const maxWallColumns = Math.round(columns * options.length.max);
    const minWallColumns = Math.round(columns * options.length.min);
    const maxWallLines = Math.round(lines * options.length.max);
    const minWallLines = Math.round(lines * options.length.min);
    const directions = options.directions;

    const interval = new Interval({
        callback: function () {
            const directionIndex = getRandomInt(0, directions.length - 1);
            const direction = directions[directionIndex];

            // don't add wall elements to close to a snake
            const exclude = [];
            const margin = 10;

            for (let a = 0; a < snakes.length; a++) {
                const snake = snakes[a];
                const first = snake.first_tail;
                const position = {
                    column: Math.round(first.position.column - margin / 2),
                    line: Math.round(first.position.line - margin / 2),
                };

                exclude.push({
                    position: position,
                    width: margin,
                    height: margin,
                });
            }

            const position = grid.getRandomEmptyPosition(exclude);

            let min = 0;
            let max = 0;

            if (options.length.percentage) {
                if (
                    direction === Direction.north ||
                    direction === Direction.south
                ) {
                    min = minWallLines;
                    max = maxWallLines;
                } else {
                    min = minWallColumns;
                    max = maxWallColumns;
                }
            } else {
                min = options.length.min;
                max = options.length.max;
            }

            let length = getRandomInt(min, max);

            // needs at a minimum to occupy one grid position
            if (length < 1) {
                length = 1;
            }

            wallLine(position, length, direction, grid);
        },
        interval: options.spawnInterval,
    });

    return interval;
}

/**
 * Add some walls on a 'stair' like layout.
 */
function setupStairsMap(snakes: Snake[], grid: Grid) {
    const columns = Options.get("columns");
    const lines = Options.get("lines");

    const horizontalLength = Math.round(columns * 0.12);
    const verticalLength = Math.round(lines * 0.09);
    const steps = 4;
    const horizontalMargin = (columns - steps * horizontalLength) / (steps + 1);
    const verticalMargin = (lines - steps * verticalLength) / (steps + 1);

    for (let a = 0; a < steps; a++) {
        const column = Math.round(
            (a + 1) * horizontalMargin + a * horizontalLength
        );
        const line = Math.round((a + 1) * verticalMargin + a * verticalLength);

        const position1 = {
            column: column,
            line: line,
        };
        const position2 = {
            column: column + horizontalLength,
            line: line,
        };

        wallLine(position1, horizontalLength, Direction.east, grid);
        wallLine(position2, verticalLength, Direction.south, grid);
    }
}

/**
 * Add some horizontal walls on the map.
 */
function setupLinesMap(snakes: Snake[], grid: Grid) {
    const linesTotal = 4;
    const columns = Options.get("columns");
    const lines = Options.get("lines");
    const length = Math.round(columns * 0.2); // of each wall
    const yDiff = Math.round(lines / (linesTotal + 1));

    // there's 3 wall lines in a row, with some margins in between
    // so: (margin)(wall)(margin)(wall)(margin)(wall)(margin)
    const margin = Math.round((columns - 3 * length) / 4);

    const column1 = margin;
    const column2 = 2 * margin + length;
    const column3 = 3 * margin + 2 * length;

    for (let a = 0; a < linesTotal; a++) {
        const line = yDiff * (a + 1);

        wallLine({ column: column1, line: line }, length, Direction.east, grid);
        wallLine({ column: column2, line: line }, length, Direction.east, grid);
        wallLine({ column: column3, line: line }, length, Direction.east, grid);
    }
}

/**
 * Add a line of 'Wall' elements in the given direction.
 */
function wallLine(
    position: GridPosition,
    length: number,
    direction: Direction,
    grid: Grid
) {
    let addColumn = 0;
    let addLine = 0;

    switch (direction) {
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

        case Direction.southEast:
            addColumn = 1;
            addLine = 1;
            break;

        case Direction.southWest:
            addColumn = -1;
            addLine = 1;
            break;

        default:
            throw Error("Invalid direction.");
    }

    let elementPosition = { ...position };

    for (let a = 0; a < length; a++) {
        // don't add on top of non-empty positions
        if (grid.isValid(elementPosition) && grid.isEmpty(elementPosition)) {
            const wall = new Wall();
            grid.add(wall, elementPosition);
        }

        elementPosition = {
            column: elementPosition.column + addColumn,
            line: elementPosition.line + addLine,
        };
    }
}
