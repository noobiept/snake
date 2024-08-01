export enum ItemType {
    tail,
    food,
    wall,
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
    width: number; // in number of grid positions
    height: number;
}

export interface CollisionElements {
    a: GridItem;
    b: GridItem;
}

export interface GridArgs {
    columns: number;
    lines: number;
    onCollision: (items: CollisionElements) => void;
    onAdd: (item: GridItem) => void;
    onRemove: (item: GridItem) => void;
}
