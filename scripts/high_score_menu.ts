import { MapName } from './main.js';
import { getMapScores, Score } from './high_score.js';
import { joinAndCapitalize, splitCamelCaseWords, boolToOnOff } from './utilities.js';


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
            const infoButton = document.createElement( 'span' );

            info.className = 'button';

            position.innerText = ( i + 1 ).toString();
            numberOfTails.innerText = score.numberOfTails.toString();
            time.innerText = score.time;
            infoButton.innerText = 'Info';
            info.onclick = function () {
                showInfoWindow( score );
            };

            info.appendChild( infoButton );
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
export function showInfoWindow( score: Score ) {

    const container = document.getElementById( 'HighScore-info' )!;
    const options = score.options;

    // clear the 'info' window
    container.innerHTML = '';

    const body = document.createElement( 'div' );
    const close = document.createElement( 'div' );


    body.innerHTML = `
        Columns: ${options.columns}<br />
        Lines: ${options.lines}<br />
        Frame: ${boolToOnOff( options.frameOn )}<br />
        Food interval: ${options.foodInterval}<br />
        Double food interval: ${options.doubleFoodInterval}<br />
        Wall interval: ${options.wallInterval}<br />
        Snake speed: ${options.snakeSpeed}
    `;


    close.className = 'button backButton';
    close.innerText = 'Close';
    close.onclick = () => {
        container.classList.add( 'hidden' );
    };

    container.appendChild( body );
    container.appendChild( close );

    // show the window
    container.classList.remove( 'hidden' );
}
