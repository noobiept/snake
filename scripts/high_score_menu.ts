import { MapName } from './main.js';
import { getMapScores, Score } from './high_score.js';
import { joinAndCapitalize, splitCamelCaseWords, boolToOnOff } from './utilities.js';


let CURRENT_SCORE: Score | undefined;   // associated 'score' of the current opened window
let CURRENT_BUTTON: HTMLElement | undefined;   // associated 'info button' of the opened window (so we can add/remove style to it)


/**
 * Build the top scores table to show on the 'high-score' page.
 */
export function buildHighScoreTable( mapName: MapName ) {
    const title = document.getElementById( 'HighScore-title' )!;
    const table = document.getElementById( 'HighScore-table' )!;

    const displayName = joinAndCapitalize( splitCamelCaseWords( mapName ) );

    table.innerHTML = '';   // clear the previous table
    title.innerHTML = `High score (${displayName})`;

    // data
    var allScores = getMapScores( mapName );

    if ( !allScores || allScores.length === 0 ) {
        table.innerHTML = 'No score yet.';
    }

    else {
        // header
        var tableRow = document.createElement( 'tr' );

        var header = [ 'Position', 'Number Of Tails', 'Time' ];
        var tableHeader;

        for ( var i = 0; i < header.length; i++ ) {
            tableHeader = document.createElement( 'th' );

            tableHeader.innerText = header[ i ];
            tableRow.appendChild( tableHeader );
        }

        table.appendChild( tableRow );

        for ( i = 0; i < allScores.length; i++ ) {
            const score = allScores[ i ];

            const tableRow = document.createElement( 'tr' );
            const position = document.createElement( 'td' );
            const numberOfTails = document.createElement( 'td' );
            const time = document.createElement( 'td' );
            const info = document.createElement( 'td' );

            info.innerText = 'Info';
            info.className = 'button';

            position.innerText = ( i + 1 ).toString();
            numberOfTails.innerText = score.numberOfTails.toString();
            time.innerText = score.time;
            info.onclick = function () {
                showInfoWindow( score, info );
            };

            tableRow.appendChild( position );
            tableRow.appendChild( numberOfTails );
            tableRow.appendChild( time );
            tableRow.append( info );
            table.appendChild( tableRow );
        }
    }
}


/**
 * Show a 'popup window' with the options that were used to achieve the selected score.
 */
function showInfoWindow( score: Score, button: HTMLElement ) {

    const container = document.getElementById( 'HighScore-info' )!;
    const options = score.options;

    // close the window
    if ( CURRENT_SCORE === score ) {
        hideInfoWindow();
        return;
    }

    clearCurrent();

    // save some references to the current opened info window
    CURRENT_SCORE = score;
    CURRENT_BUTTON = button;

    // clear the 'info' window
    container.innerHTML = '';

    const body = document.createElement( 'div' );
    const close = document.createElement( 'div' );

    addInfoValue( 'Tails: ', score.numberOfTails, body );
    addInfoValue( 'Time: ', score.time, body );
    addInfoValue( 'Columns: ', options.columns, body );
    addInfoValue( 'Lines: ', options.lines, body );
    addInfoValue( 'Frame: ', boolToOnOff( options.frameOn ), body );
    addInfoValue( 'Food interval: ', options.foodInterval, body );
    addInfoValue( 'Double food interval: ', options.doubleFoodInterval, body );
    addInfoValue( 'Wall interval: ', options.wallInterval, body );
    addInfoValue( 'Snake speed: ', options.snakeSpeed, body );

    close.className = 'button backButton';
    close.innerText = 'Close';
    close.onclick = () => {
        hideInfoWindow();
    };

    container.appendChild( body );
    container.appendChild( close );

    // show the window
    container.classList.remove( 'hidden' );

    // style the 'info' button
    button.classList.add( 'selectedInfo' );
}


/**
 * Hide the 'info' window.
 */
export function hideInfoWindow() {
    const container = document.getElementById( 'HighScore-info' )!;
    container.classList.add( 'hidden' );

    clearCurrent();
}


/**
 * Clear the current saved values (of the button/score).
 */
function clearCurrent() {
    if ( CURRENT_BUTTON ) {
        CURRENT_BUTTON.classList.remove( 'selectedInfo' );
    }

    CURRENT_BUTTON = undefined;
    CURRENT_SCORE = undefined;
}


/**
 * Show the text, then the value and add that to the container.
 */
function addInfoValue( text: string, value: any, container: HTMLElement ) {
    const textElement = document.createElement( 'div' );
    textElement.innerText = text;

    const valueElement = document.createElement( 'span' );
    valueElement.className = 'displayValue';
    valueElement.innerText = value;

    textElement.appendChild( valueElement );
    container.append( textElement );
}
