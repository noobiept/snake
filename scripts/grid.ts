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
    onCollision: ( a: GridItem, b: GridItem ) => boolean;
}

export class Grid {
    static size = 10;   // size of each grid item in pixels

    grid: ( GridItem | undefined )[][];
    args: GridArgs;

    constructor( args: GridArgs ) {
        this.args = args;
        this.grid = [];

        // initialize the 'grid' array
        for ( let a = 0; a < args.columns; a++ ) {
            this.grid[ a ] = [];
        }
    }

    add( item: GridItem, position: Position ) {
        const column = position.column;
        const line = position.line;

        this.grid[ column ][ line ] = item;

        const shape = item.shape;
        shape.x = column * Grid.size
        shape.y = line * Grid.size;

        item.position = position;

        STAGE.addChild( shape );
    }

    remove( position: Position ) {
        const item = this.grid[ position.column ][ position.line ];

        this.grid[ position.column ][ position.line ] = undefined;

        if ( item ) {
            STAGE.removeChild( item.shape );
        }

        return item;
    }


    /**
     * Remove all the items from the grid.
     */
    removeAll() {
        for ( let column = 0; column < this.grid.length; column++ ) {
            const columns = this.grid[ column ];

            for ( let line = 0; line < columns.length; line++ ) {

                this.remove( {
                    column: column,
                    line: line
                } );
            }
        }
    }


    get( position: Position ) {
        return this.grid[ position.column ][ position.line ];
    }

    move( from: Position, to: Position ) {
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

        const item = this.grid[ from.column ][ from.line ];
        const existingItem = this.grid[ to.column ][ to.line ];

        if ( item && existingItem ) {
            const ok = this.args.onCollision( item, existingItem );

            if ( !ok ) {
                return;
            }
        }

        this.grid[ from.column ][ from.line ] = undefined;
        this.grid[ to.column ][ to.line ] = item;

        if ( item ) {
            item.shape.x = to.column * Grid.size;
            item.shape.y = to.line * Grid.size;

            item.position = to;
        }
    }
}
