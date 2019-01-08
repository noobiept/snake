import { getRandomInt } from "../other/utilities.js";
import { CollisionElements, addToStage, removeFromStage } from "./game.js";


export enum ItemType {
    tail, food, doubleFood, wall
}

export interface GridItem {
    readonly shape: createjs.DisplayObject;
    readonly type: ItemType;
    position: GridPosition;
}

export interface GridPosition {
    column: number;
    line: number;
}

export interface GridRectangle {
    position: GridPosition;
    width: number;  // in number of grid positions
    height: number;
}

interface GridArgs {
    columns: number;
    lines: number;
    onCollision: ( items: CollisionElements ) => void;
}


/**
 * A 2d grid that is used by the game, to keep track of all the elements that were added and its current position.
 */
export class Grid {
    static readonly size = 10;   // size of each grid item in pixels
    static readonly halfSize = Grid.size / 2;

    private grid: ( GridItem[] )[][];
    readonly args: GridArgs;


    constructor( args: GridArgs ) {
        this.args = args;
        this.grid = [];

        // initialize the 'grid' array
        for ( let column = 0; column < args.columns; column++ ) {
            this.grid[ column ] = [];

            for ( let line = 0; line < args.lines; line++ ) {
                this.grid[ column ][ line ] = [];
            }
        }
    }


    /**
     * Add an item to the grid on the given position.
     */
    add( item: GridItem, position: GridPosition ) {
        const column = position.column;
        const line = position.line;

        if ( column >= this.args.columns ||
            line >= this.args.lines ||
            column < 0 ||
            line < 0 ) {
            return;
        }

        this.grid[ column ][ line ].push( item );

        const shape = item.shape;
        shape.x = column * Grid.size + Grid.halfSize;
        shape.y = line * Grid.size + Grid.halfSize;

        item.position = position;

        addToStage( shape );
    }


    /**
     * Remove the item from the grid.
     */
    remove( item: GridItem ) {
        const position = item.position;

        const index = this.grid[ position.column ][ position.line ].indexOf( item );
        if ( index < 0 ) {
            throw Error( 'Item not in the correct position.' )
        }

        this.grid[ position.column ][ position.line ].splice( index, 1 );
        removeFromStage( item.shape );

        return item;
    }


    /**
     * Remove all the items from the grid.
     */
    removeAll() {
        for ( let column = 0; column < this.grid.length; column++ ) {
            const columns = this.grid[ column ];

            for ( let line = 0; line < columns.length; line++ ) {

                const lines = columns[ line ];

                for ( let a = lines.length - 1; a >= 0; a-- ) {
                    const item = lines[ a ];
                    this.remove( item );
                }
            }
        }
    }


    /**
     * Check if the given position is empty.
     */
    isEmpty( position: GridPosition ) {
        return this.grid[ position.column ][ position.line ].length === 0;
    }


    /**
     * Check if the given position is valid (if its within the grid limits).
     */
    isValid( position: GridPosition ) {
        if ( position.column < 0 ||
            position.column >= this.args.columns ||
            position.line < 0 ||
            position.line >= this.args.lines ) {
            return false;
        }

        return true;
    }


    /**
     * Move an item to a different position in the grid.
     */
    move( item: GridItem, to: GridPosition ) {
        if ( !item ) {
            return;
        }

        const columns = this.args.columns;
        const lines = this.args.lines;

        // deal with the edges of the grid (move to the other border when trying to go outside of the grid)
        if ( to.column >= columns ) {
            to.column = 0;
        }

        else if ( to.column < 0 ) {
            to.column = columns - 1;
        }

        if ( to.line >= lines ) {
            to.line = 0;
        }

        else if ( to.line < 0 ) {
            to.line = lines - 1;
        }

        const existingItems = this.grid[ to.column ][ to.line ];

        // a collision happened between the item and other items on the destination position
        if ( existingItems.length > 0 ) {
            for ( let a = 0; a < existingItems.length; a++ ) {
                const otherItem = existingItems[ a ];
                this.args.onCollision( {
                    a: item,
                    b: otherItem
                } );
            }
        }

        // remove from the previous position
        const from = item.position;
        const index = this.grid[ from.column ][ from.line ].indexOf( item );
        if ( index < 0 ) {
            throw Error( 'Item not in the correct position.' );
        }

        this.grid[ from.column ][ from.line ].splice( index, 1 );

        // add to the new position
        this.grid[ to.column ][ to.line ].push( item );

        // update the position of the item
        item.shape.x = to.column * Grid.size + Grid.halfSize;
        item.shape.y = to.line * Grid.size + Grid.halfSize;
        item.position = to;
    }


    /**
     * Get a random position in the grid that doesn't have any item in there yet.
     * You can optionally exclude certain areas from the search.
     */
    getRandomEmptyPosition( excludeRectangles?: GridRectangle[] ) {
        const emptyPositions = [];
        const grid = this.grid;
        const columns = this.args.columns;
        const lines = this.args.lines;

        for ( let column = 0; column < columns; column++ ) {
            for ( let line = 0; line < lines; line++ ) {
                const items = grid[ column ][ line ];

                if ( items.length === 0 ) {
                    const position = { column: column, line: line };

                    if ( !positionInRectangles( position, excludeRectangles ) ) {
                        emptyPositions.push( {
                            column: column,
                            line: line
                        } );
                    }
                }
            }
        }

        // there's no empty positions anymore, just put in a random occupied position instead
        if ( emptyPositions.length === 0 ) {
            return {
                column: getRandomInt( 0, columns ),
                line: getRandomInt( 0, lines )
            };
        }

        else {
            const index = getRandomInt( 0, emptyPositions.length - 1 );
            return emptyPositions[ index ];
        }
    }
}


/**
 * Check if a position is within any of the given rectangles.
 */
function positionInRectangles( position: GridPosition, rectangles?: GridRectangle[] ) {
    if ( !rectangles ) {
        return false;
    }

    for ( let a = 0; a < rectangles.length; a++ ) {
        const rect = rectangles[ a ];

        if ( !( position.column < rect.position.column ||
            position.column > rect.position.column + rect.width ||
            position.line < rect.position.line ||
            position.line > rect.position.line + rect.height ) ) {
            return true;
        }
    }
}
