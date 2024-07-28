import Tail from "./tail.js";
import Food from "./food.js";
import { addToGrid, addTimeout } from "./game.js";
import { Direction, KeyboardMapping } from "../main.js";
import { GridPosition } from "./grid.js";

interface SnakeArgs {
    speed: number;
    position: GridPosition;
    startingDirection: Direction;
    color: string;
    keyboardMapping: KeyboardMapping;
}

/**
 * The snake is the element that the player controls.
 */
export default class Snake {
    private speed: number = 0;
    private interval: number = 0;
    private color: string;
    private all_tails: Tail[];
    private keys_held: {
        left: boolean;
        right: boolean;
        up: boolean;
        down: boolean;
    };
    private keyboard_mapping: KeyboardMapping;
    readonly first_tail: Tail;

    constructor(args: SnakeArgs) {
        this.all_tails = [];
        this.color = args.color;

        this.setSpeed(args.speed);

        // keys being pressed/held
        this.keys_held = {
            left: false,
            right: false,
            up: false,
            down: false,
        };

        // tells what key represent the up key held, the down etc (each player will have a different set of keys)
        // for example: { left: EVENT_KEY.a, right: EVENT_KEY.d, (...) }
        this.keyboard_mapping = args.keyboardMapping;

        // add a starting tail
        this.first_tail = this.addTail(args.position, args.startingDirection);
    }

    /**
     * Add a tail either on the given position, or after the last tail.
     */
    addTail(position?: GridPosition, direction?: Direction) {
        const last = this.getLastTail();

        // add at the end of the snake
        if (typeof position === "undefined") {
            const lastDirection = last.getCurrentDirection();
            const lastPosition = last.position;

            if (lastDirection === Direction.west) {
                position = {
                    column: lastPosition.column + 1,
                    line: lastPosition.line,
                };
            } else if (lastDirection === Direction.east) {
                position = {
                    column: lastPosition.column - 1,
                    line: lastPosition.line,
                };
            } else if (lastDirection === Direction.north) {
                position = {
                    column: lastPosition.column,
                    line: lastPosition.line + 1,
                };
            } else if (lastDirection === Direction.south) {
                position = {
                    column: lastPosition.column,
                    line: lastPosition.line - 1,
                };
            } else {
                throw Error("Invalid direction on the last tail.");
            }
        }

        if (typeof direction === "undefined") {
            direction = last.getCurrentDirection();
        }

        let path = [];

        // copy the path of the last tail
        // this tail continues the same path as the previous last one
        if (this.all_tails.length !== 0) {
            path = last.clonePath();
        }

        const tail = new Tail(this.color, direction, path);
        this.all_tails.push(tail);

        addToGrid(tail, position);

        return tail;
    }

    /**
     * Change the direction of the snake (at the current x/y position).
     */
    changeDirection(newDirection: Direction) {
        const currentDirection = this.getDirection();

        // already going that way
        if (currentDirection == newDirection) {
            return;
        }

        // don't allow to go to the opposing direction
        if (
            (currentDirection == Direction.west &&
                newDirection == Direction.east) ||
            (currentDirection == Direction.east &&
                newDirection == Direction.west) ||
            (currentDirection == Direction.north &&
                newDirection == Direction.south) ||
            (currentDirection == Direction.south &&
                newDirection == Direction.north)
        ) {
            return;
        }

        const position = this.first_tail.position;
        const numberOfTails = this.all_tails.length;

        for (let i = 0; i < numberOfTails; i++) {
            const tail = this.all_tails[i];

            tail.addNewDirection({
                ...position,
                direction: newDirection,
            });
        }
    }

    /**
     * Get the number of tails that the snake currently has.
     */
    getNumberOfTails() {
        return this.all_tails.length;
    }

    /**
     * Get the tail object at the given position.
     */
    getTail(position: number) {
        if (position < 0 || position >= this.all_tails.length) {
            return null;
        }

        return this.all_tails[position];
    }

    /**
     * Get the last tail on the snake. There's always at least 1 tail in the snake.
     */
    getLastTail() {
        return this.all_tails[this.all_tails.length - 1];
    }

    /**
     * Get the current direction the snake is going towards.
     */
    getDirection() {
        return this.first_tail.getCurrentDirection();
    }

    /**
     * Change the snake speed.
     */
    setSpeed(speed: number) {
        this.speed = speed;
        this.interval = (1 / this.speed) * 1000;
    }

    /**
     * Return the time interval between move updates, so we can maintain the desired snake speed.
     */
    getMovementInterval() {
        return this.interval;
    }

    /**
     * Deal with the keyboard inputs.
     */
    onKeyDown(keyCode: string) {
        const keysHeld = this.keys_held;
        const keyboardMapping = this.keyboard_mapping;

        switch (keyCode) {
            case keyboardMapping.left:
            case keyboardMapping.left2:
                keysHeld.left = true;
                return false;

            case keyboardMapping.right:
            case keyboardMapping.right2:
                keysHeld.right = true;
                return false;

            case keyboardMapping.up:
            case keyboardMapping.up2:
                keysHeld.up = true;
                return false;

            case keyboardMapping.down:
            case keyboardMapping.down2:
                keysHeld.down = true;
                return false;
        }

        return true;
    }

    /**
     * Deal with the keyboard inputs.
     */
    onKeyUp(keyCode: string) {
        const keysHeld = this.keys_held;
        const keyboardMapping = this.keyboard_mapping;

        switch (keyCode) {
            case keyboardMapping.left:
            case keyboardMapping.left2:
                keysHeld.left = false;
                return false;

            case keyboardMapping.right:
            case keyboardMapping.right2:
                keysHeld.right = false;
                return false;

            case keyboardMapping.up:
            case keyboardMapping.up2:
                keysHeld.up = false;
                return false;

            case keyboardMapping.down:
            case keyboardMapping.down2:
                keysHeld.down = false;
                return false;
        }

        return true;
    }

    /**
     * When the snakes eats a type of food, there's some effects we need to apply to the snake (more tails, etc).
     */
    eat(food: Food) {
        const effects = food.eaten;

        // add more tails
        for (let a = 0; a < effects.tails; a++) {
            this.addTail();
        }

        // change the speed
        const speed = effects.speed;

        if (speed) {
            this.setSpeed(this.speed * speed.multiplier);

            addTimeout({
                callback: () => {
                    this.setSpeed(this.speed / speed.multiplier);
                },
                duration: speed.duration,
            });
        }
    }

    /**
     * Deal with the snake's movement at every tick (based on the player's inputs).
     */
    movementTick() {
        const keysHeld = this.keys_held;
        const direction = this.getDirection();

        if (keysHeld.left) {
            if (keysHeld.down) {
                if (
                    direction == Direction.west ||
                    direction == Direction.east
                ) {
                    this.changeDirection(Direction.south);
                } else if (
                    direction == Direction.south ||
                    direction == Direction.north
                ) {
                    this.changeDirection(Direction.west);
                }
            } else if (keysHeld.up) {
                if (
                    direction == Direction.west ||
                    direction == Direction.east
                ) {
                    this.changeDirection(Direction.north);
                } else if (
                    direction == Direction.north ||
                    direction == Direction.south
                ) {
                    this.changeDirection(Direction.west);
                }
            } else {
                this.changeDirection(Direction.west);
            }
        } else if (keysHeld.right) {
            if (keysHeld.down) {
                if (
                    direction == Direction.east ||
                    direction == Direction.west
                ) {
                    this.changeDirection(Direction.south);
                } else if (
                    direction == Direction.south ||
                    direction == Direction.north
                ) {
                    this.changeDirection(Direction.east);
                }
            } else if (keysHeld.up) {
                if (
                    direction == Direction.east ||
                    direction == Direction.west
                ) {
                    this.changeDirection(Direction.north);
                } else if (
                    direction == Direction.north ||
                    direction == Direction.south
                ) {
                    this.changeDirection(Direction.east);
                }
            } else {
                this.changeDirection(Direction.east);
            }
        } else if (keysHeld.up) {
            this.changeDirection(Direction.north);
        } else if (keysHeld.down) {
            this.changeDirection(Direction.south);
        }
    }

    /**
     * Return an array with all the tails that are part of this snake.
     */
    getAllTails() {
        return [...this.all_tails];
    }
}
