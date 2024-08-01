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
function isNumber(char: string) {
    return !isNaN(parseInt(char, 10));
}

/**
 * Capitalize a word (first letter upper case).
 */
function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Convert a 'time' in milliseconds to a string in seconds.
 */
export function timeToString(time: number) {
    return (time / 1000).toFixed(1);
}
