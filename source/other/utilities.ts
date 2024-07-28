/**
 * Checks if a x/y position is within a range around other x/y position.
 */
export function isNextTo(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    range: number
) {
    // we make a 'box' with the target position and the range
    const boxLeft = targetX - range / 2;
    const boxRight = targetX + range / 2;

    const boxTop = targetY - range / 2;
    const boxBottom = targetY + range / 2;

    if (x >= boxLeft && x <= boxRight && y >= boxTop && y <= boxBottom) {
        return true;
    } else {
        return false;
    }
}

/**
 * If an x/y position is out of bounds, it overflows (goes to the other side of the canvas, the amount it overflows).
 */
export function checkOverflowPosition(x_or_y: number, limit: number) {
    if (x_or_y < 0) {
        x_or_y = limit - -x_or_y;
    } else if (x_or_y > limit) {
        x_or_y -= limit;
    }

    return x_or_y;
}

/**
 * Convert a boolean value to the equivalent display string.
 */
export function boolToOnOff(value: boolean) {
    if (value == true) {
        return "On";
    } else {
        return "Off";
    }
}

/**
 * Join and capitalize the words and return the resulting string.
 */
export function joinAndCapitalize(words: string[]) {
    let result = "";

    for (let a = 0; a < words.length; a++) {
        const word = words[a];
        const capitalized = capitalize(word);

        result += capitalized;

        // add a space between the words, apart from the last one
        if (a < words.length - 1) {
            result += " ";
        }
    }

    return result;
}

/**
 * Split the string into a list with all the words. For example 'oneTwo' into '[ 'one, 'Two' ]'.
 */
export function splitCamelCaseWords(text: string) {
    const words = [];
    let start = 0;

    for (let a = 0; a < text.length; a++) {
        const letter = text[a];

        if (!isNumber(letter) && letter === letter.toUpperCase()) {
            const word = text.slice(start, a);
            words.push(word);

            start = a;
        }
    }

    // add the last one
    words.push(text.slice(start));

    return words;
}

/**
 * To check if the given character is a number or not.
 */
export function isNumber(char: string) {
    return !isNaN(parseInt(char, 10));
}

/**
 * Capitalize a word (first letter upper case).
 */
export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Convert a 'time' in milliseconds to a string in seconds.
 */
export function timeToString(time: number) {
    return (time / 1000).toFixed(1);
}
