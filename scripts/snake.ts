import * as GameMenu from './game_menu.js';
import * as Game from './game.js';
import Tail from "./tail.js";
import Food from './food.js';
import Wall from './wall.js';
import { Direction, KeyboardMapping } from './main.js';
import { checkCollision } from './utilities.js';
import { GridItem, Position } from "./grid.js";


interface SnakeArgs {
    position: Position;
    startingDirection: Direction;
    color: string;
    keyboardMapping: KeyboardMapping;
}


export default class Snake {
    color: string;

    all_tails: Tail[];
    private keys_held: { left: boolean; right: boolean; up: boolean; down: boolean };
    private keyboard_mapping: KeyboardMapping;
    private first_tail: Tail;


    constructor( args: SnakeArgs ) {
        this.all_tails = [];
        this.color = args.color;

        // keys being pressed/held
        this.keys_held = {
            left: false,
            right: false,
            up: false,
            down: false
        };

        // tells what key represent the up key held, the down etc (each player will have a different set of keys)
        // for example: { left: EVENT_KEY.a, right: EVENT_KEY.d, (...) }
        this.keyboard_mapping = args.keyboardMapping;

        // add a starting tail
        this.first_tail = this.addTail( args.position, args.startingDirection );
    }


    /**
     * Add a tail either on the given position, or after the last tail.
     */
    addTail( position?: Position, direction?: Direction ) {
        const last = this.getLastTail();

        // add at the end of the snake
        if ( !position ) {
            const lastDirection = last.direction;
            const lastPosition = last.position;

            if ( lastDirection === Direction.left ) {
                position = {
                    column: lastPosition.column + 1,
                    line: lastPosition.line
                };
            }

            else if ( lastDirection === Direction.right ) {
                position = {
                    column: lastPosition.column - 1,
                    line: lastPosition.line
                };
            }

            else if ( lastDirection === Direction.up ) {
                position = {
                    column: lastPosition.column,
                    line: lastPosition.line + 1
                };
            }

            else if ( lastDirection === Direction.down ) {
                position = {
                    column: lastPosition.column,
                    line: lastPosition.line - 1
                };
            }

            else {
                throw Error( "Invalid direction on the last tail." );
            }
        }

        if ( !direction ) {
            direction = last.direction;
        }


        let path = [];

        // copy the path of the last tail
        if ( this.all_tails.length !== 0 ) {
            // this tail continues the same path as the previous last one
            // using JSON here to do a copy of the array of objects (we can't just copy the references for the object)
            var pathJson = JSON.stringify( last.path );
            path = JSON.parse( pathJson );
        }

        var tail = new Tail( this, direction, path );
        this.all_tails.push( tail );

        Game.GRID.add( tail, position );

        //GameMenu.updateScore( Snake.ALL_SNAKES.indexOf( this ), this.all_tails.length ); //HERE

        return tail;
    }


    /*
        Return the position of the first tail (so, of the snake)
     */
    getX() {
        return this.first_tail.getX();
    }


    getY() {
        return this.first_tail.getY();
    }


    /**
     * Change the direction of the snake (at the current x/y position).
     */
    changeDirection( newDirection: Direction ) {
        var currentDirection = this.getDirection();

        // already going that way
        if ( currentDirection == newDirection ) {
            return;
        }

        // don't allow to go to the opposing direction
        if ( ( currentDirection == Direction.left && newDirection == Direction.right ) ||
            ( currentDirection == Direction.right && newDirection == Direction.left ) ||
            ( currentDirection == Direction.up && newDirection == Direction.down ) ||
            ( currentDirection == Direction.down && newDirection == Direction.up ) ) {
            return;
        }

        const position = this.first_tail.position;
        const numberOfTails = this.all_tails.length;

        for ( var i = 0; i < numberOfTails; i++ ) {
            const tail = this.all_tails[ i ];

            tail.addNewDirection( {
                ...position,
                direction: newDirection
            } );
        }
    }


    getNumberOfTails() {
        return this.all_tails.length;
    }


    getTail( position: number ) {
        if ( position < 0 || position >= this.all_tails.length ) {
            return null;
        }

        return this.all_tails[ position ];
    }


    /**
     * There's always at least 1 tail in the snake.
     */
    getLastTail() {
        return this.all_tails[ this.all_tails.length - 1 ]
    }


    getDirection() {
        return this.first_tail.direction;
    }


    onKeyDown( keyCode: number ) {
        var keysHeld = this.keys_held;
        var keyboardMapping = this.keyboard_mapping;

        switch ( keyCode ) {
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


    onKeyUp( keyCode: number ) {
        var keysHeld = this.keys_held;
        var keyboardMapping = this.keyboard_mapping;

        switch ( keyCode ) {
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
    eat( food: Food ) {
        const effects = food.eaten;

        // add more tails
        for ( let a = 0; a < effects.tails; a++ ) {
            this.addTail();
        }
    }


    /**
     * Deal with the snake's movement at every tick (based on the player's inputs).
     */
    movementTick() {
        var keysHeld = this.keys_held;
        var direction = this.getDirection();

        if ( keysHeld.left ) {
            if ( keysHeld.down ) {
                if ( direction == Direction.left || direction == Direction.right ) {
                    this.changeDirection( Direction.down );
                }

                else if ( direction == Direction.down || direction == Direction.up ) {
                    this.changeDirection( Direction.left );
                }
            }

            else if ( keysHeld.up ) {
                if ( direction == Direction.left || direction == Direction.right ) {
                    this.changeDirection( Direction.up );
                }

                else if ( direction == Direction.up || direction == Direction.down ) {
                    this.changeDirection( Direction.left );
                }
            }

            else {
                this.changeDirection( Direction.left );
            }
        }

        else if ( keysHeld.right ) {
            if ( keysHeld.down ) {
                if ( direction == Direction.right || direction == Direction.left ) {
                    this.changeDirection( Direction.down );
                }

                else if ( direction == Direction.down || direction == Direction.up ) {
                    this.changeDirection( Direction.right );
                }
            }

            else if ( keysHeld.up ) {
                if ( direction == Direction.right || direction == Direction.left ) {
                    this.changeDirection( Direction.up );
                }

                else if ( direction == Direction.up || direction == Direction.down ) {
                    this.changeDirection( Direction.right );
                }
            }

            else {
                this.changeDirection( Direction.right );
            }
        }

        else if ( keysHeld.up ) {
            this.changeDirection( Direction.up );
        }

        else if ( keysHeld.down ) {
            this.changeDirection( Direction.down );
        }
    }


    tick() {
        var firstTail = this.first_tail;

        var firstX = firstTail.getX();
        var firstY = firstTail.getY();
        var firstWidth = firstTail.getWidth() / 2;
        var firstHeight = firstTail.getHeight() / 2;

        var tail;
        var allTails = this.all_tails;


        this.movementTick();
        /*
                // :: deal with the collision detection between the snake and tails :: //
                // 'i' starts at 1, to not check the first tail (that's the one we're comparing with)
                for ( var i = 1; i < allTails.length; i++ ) {
                    tail = allTails[ i ];

                    if ( checkCollision( firstX, firstY, firstWidth, firstHeight, tail.getX(), tail.getY(), tail.getWidth(), tail.getHeight() ) == true ) {
                        tail.asBeenHit();

                        Game.over();
                        return;
                    }
                }

                var a, b;   //HERE

                // :: check collision between the snake's tails and the food :: //
                for ( a = 0; a < Food.ALL_FOOD.length; a++ ) {
                    var food = Food.ALL_FOOD[ a ];
                    var foodX = food.getX();
                    var foodY = food.getY();
                    var foodWidth = food.getWidth();
                    var foodHeight = food.getHeight();

                    for ( b = 0; b < allTails.length; b++ ) {
                        tail = allTails[ b ];

                        if ( checkCollision( foodX, foodY, foodWidth, foodHeight, tail.getX(), tail.getY(), tail.getWidth(), tail.getHeight() ) == true ) {
                            food.eat( this );

                            food.remove();
                            a--;
                            break;
                        }
                    }
                }

                // :: check collision between the snake and the walls :: //

                var wall;

                for ( i = 0; i < Wall.ALL_WALLS.length; i++ ) {
                    wall = Wall.ALL_WALLS[ i ];

                    if ( checkCollision( firstX, firstY, firstWidth, firstHeight, wall.getX(), wall.getY(), wall.getWidth(), wall.getHeight() ) ) {
                        wall.asBeenHit();

                        Game.over();
                        return;
                    }
                }

        // :: deal with the movement of the tails :: //

        for ( i = 0; i < allTails.length; i++ ) {
            tail = allTails[ i ];
            tail.tick();
        }*/
    }
}
