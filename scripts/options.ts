import * as AppStorage from './app_storage.js';


interface OptionsData {
    columns: number;
    lines: number;
    frameOn: boolean;
    wallInterval: number;   // the intervals are in milliseconds
    foodInterval: number;
    doubleFoodInterval: number;
    snakeSpeed: number;
}

const OPTIONS: OptionsData = {
    columns: 50,
    lines: 50,
    frameOn: false,
    wallInterval: 4000,
    foodInterval: 1000,
    doubleFoodInterval: 5000,
    snakeSpeed: 50
};


/**
 * Validate and load the given options (if not valid then it uses the default values).
 */
export function load( options?: OptionsData ) {
    if ( options ) {

        if ( Number.isInteger( options.columns ) ) {
            OPTIONS.columns = options.columns;
        }

        if ( Number.isInteger( options.lines ) ) {
            OPTIONS.lines = options.lines;
        }

        if ( typeof options.frameOn === 'boolean' ) {
            OPTIONS.frameOn = options.frameOn;
        }

        if ( Number.isInteger( options.wallInterval ) ) {
            OPTIONS.wallInterval = options.wallInterval;
        }

        if ( Number.isInteger( options.foodInterval ) ) {
            OPTIONS.foodInterval = options.foodInterval;
        }

        if ( Number.isInteger( options.doubleFoodInterval ) ) {
            OPTIONS.doubleFoodInterval = options.doubleFoodInterval;
        }

        if ( Number.isInteger( options.snakeSpeed ) ) {
            OPTIONS.snakeSpeed = options.snakeSpeed;
        }
    }
}


/**
 * Save to local storage the current options values.
 */
export function save() {
    AppStorage.setData( { snake_options: OPTIONS } );
}


/**
 * Get the current value of the given option.
 */
export function get<Key extends keyof OptionsData>( option: Key ) {
    return OPTIONS[ option ];
}


/**
 * Set a new value to the given option.
 */
export function set<Key extends keyof OptionsData>( option: Key, value: OptionsData[ Key ] ) {
    OPTIONS[ option ] = value;
}
