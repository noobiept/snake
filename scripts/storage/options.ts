import * as AppStorage from './app_storage.js';


export interface OptionsData {
    columns: number;
    lines: number;
    frameOn: boolean;
    wallInterval: number;   // the intervals are in milliseconds
    appleInterval: number;
    orangeInterval: number;
    snakeSpeed: number; // is in Hz (movement frequency)
}

export type OptionsKey = keyof OptionsData;

// only the keys that result in the specified type
export type KeysOfType<T, TProp> = { [ P in keyof T ]: T[ P ] extends TProp ? P : never }[ keyof T ];


const OPTIONS: OptionsData = {
    columns: 60,
    lines: 40,
    frameOn: false,
    wallInterval: 4000,
    appleInterval: 1000,
    orangeInterval: 5000,
    snakeSpeed: 20
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

        if ( Number.isInteger( options.appleInterval ) ) {
            OPTIONS.appleInterval = options.appleInterval;
        }

        if ( Number.isInteger( options.orangeInterval ) ) {
            OPTIONS.orangeInterval = options.orangeInterval;
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
export function get<Key extends OptionsKey>( option: Key ) {
    return OPTIONS[ option ];
}


/**
 * Set a new value to the given option.
 */
export function set<Key extends OptionsKey>( option: Key, value: OptionsData[ Key ] ) {
    OPTIONS[ option ] = value;
}


/**
 * Get a new object with the current options values.
 */
export function clone() {
    return Object.assign( {}, OPTIONS );
}
