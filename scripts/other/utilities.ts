/**
 * Keys code for the keyboard events.
 */
export const EVENT_KEY = {

    backspace: 8,
    tab: 9,
    enter: 13,
    esc: 27,
    space: 32,
    end: 35,
    home: 36,
    leftArrow: 37,
    upArrow: 38,
    rightArrow: 39,
    downArrow: 40,
    del: 46,

    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,

    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,

    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123

};


/**
 * Checks if a x/y position is within a range around other x/y position.
 */
export function isNextTo( x: number, y: number, targetX: number, targetY: number, range: number ) {
    // we make a 'box' with the target position and the range
    var boxLeft = targetX - range / 2;
    var boxRight = targetX + range / 2;

    var boxTop = targetY - range / 2;
    var boxBottom = targetY + range / 2;

    if ( x >= boxLeft && x <= boxRight && y >= boxTop && y <= boxBottom ) {
        return true;
    }

    else {
        return false;
    }
}


/**
 * Check if there's a collision between two rectangles.
 */
export function checkCollision( oneX: number, oneY: number, oneWidth: number, oneHeight: number, twoX: number, twoY: number, twoWidth: number, twoHeight: number ) {
    // calculate the position of the corners of the object (as a rectangle)
    // the position origin of the objects is in the center
    var oneLeft = oneX - oneWidth / 2;
    var oneRight = oneX + oneWidth / 2;
    var oneTop = oneY - oneHeight / 2;
    var oneBottom = oneY + oneHeight / 2;

    var twoLeft = twoX - twoWidth / 2;
    var twoRight = twoX + twoWidth / 2;
    var twoTop = twoY - twoHeight / 2;
    var twoBottom = twoY + twoHeight / 2;

    if ( oneRight >= twoLeft && oneLeft <= twoRight && oneTop <= twoBottom && oneBottom >= twoTop ) {
        return true;
    }

    return false;
}


/**
 * Returns a random integer in the given range (inclusive).
 */
export function getRandomInt( min: number, max: number ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}


/**
 * Returns a random float in the given range (inclusive).
 */
export function getRandomFloat( min: number, max: number ) {
    return Math.random() * ( max - min ) + min;
}


/**
 * If an x/y position is out of bounds, it overflows (goes to the other side of the canvas, the amount it overflows).
 */
export function checkOverflowPosition( x_or_y: number, limit: number ) {
    if ( x_or_y < 0 ) {
        x_or_y = limit - -x_or_y;
    }

    else if ( x_or_y > limit ) {
        x_or_y -= limit;
    }

    return x_or_y;
}


/**
 * Convert a boolean value to the equivalent display string.
 */
export function boolToOnOff( value: boolean ) {
    if ( value == true ) {
        return 'On';
    }

    else {
        return 'Off';
    }
}


/**
 * Join and capitalize the words and return the resulting string.
 */
export function joinAndCapitalize( words: string[] ) {
    let result = '';

    for ( let a = 0; a < words.length; a++ ) {
        const word = words[ a ];
        const capitalized = capitalize( word );

        result += capitalized;

        // add a space between the words, apart from the last one
        if ( a < words.length - 1 ) {
            result += ' ';
        }
    }

    return result;
}


/**
 * Split the string into a list with all the words. For example 'oneTwo' into '[ 'one, 'Two' ]'.
 */
export function splitCamelCaseWords( text: string ) {
    const words = [];
    let start = 0;

    for ( let a = 0; a < text.length; a++ ) {
        const letter = text[ a ];

        if ( !isNumber( letter ) && letter === letter.toUpperCase() ) {
            const word = text.slice( start, a );
            words.push( word );

            start = a;
        }
    }

    // add the last one
    words.push( text.slice( start ) );

    return words;
}


/**
 * To check if the given character is a number or not.
 */
export function isNumber( char: string ) {
    return !isNaN( parseInt( char, 10 ) );
}


/**
 * Capitalize a word (first letter upper case).
 */
export function capitalize( word: string ) {
    return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
}


/**
 * Convert a 'time' in milliseconds to a string in seconds.
 */
export function timeToString( time: number ) {
    return ( time / 1000 ).toFixed( 1 );
}
