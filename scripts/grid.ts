import { STAGE } from './main.js';


export enum ItemType {
    tail, food, doubleFood, wall
}

export interface GridItem {
    shape: createjs.DisplayObject;
    position: Position;
    type: ItemType;
}

export interface Position {
    column: number;
    line: number;
}

interface GridArgs {
    columns: number;
    lines: number;
    onCollision: ( a: GridItem, b: GridItem ) => void;
}

export class Grid {
    static readonly size = 10;   // size of each grid item in pixels
    static readonly halfSize = Grid.size / 2;

    grid: ( GridItem[] )[][];
    args: GridArgs;

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

    add( item: GridItem, position: Position ) {
        const column = position.column;
        const line = position.line;

        this.grid[ column ][ line ].push( item );

        const shape = item.shape;
        shape.x = column * Grid.size + Grid.halfSize;
        shape.y = line * Grid.size + Grid.halfSize;

        item.position = position;

        STAGE.addChild( shape );
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
        STAGE.removeChild( item.shape );

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


    get( position: Position ) {
        return this.grid[ position.column ][ position.line ];
    }


    move( item: GridItem, to: Position ) {
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
                this.args.onCollision( item, otherItem );
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
}
