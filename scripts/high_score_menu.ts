import { MapName } from './main.js';
import { getMapScores, Score } from './high_score.js';
import { joinAndCapitalize, splitCamelCaseWords } from './utilities.js';


/**
 * Build the top scores table to show on the 'high-score' page.
 */
export function buildHighScoreTable( mapName: MapName ) {
    var title = document.getElementById( 'HighScoreTitle' )!;
    var table = document.getElementById( 'HighScore-table' )!;

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
            const options = document.createElement( 'td' );

            position.innerText = ( i + 1 ).toString();
            numberOfTails.innerText = score.numberOfTails.toString();
            time.innerText = score.time;
            options.innerText = 'Info';
            options.onclick = function () {
                showPopupWindow( score );
            };

            tableRow.appendChild( position );
            tableRow.appendChild( numberOfTails );
            tableRow.appendChild( time );
            tableRow.append( options );
            table.appendChild( tableRow );
        }
    }
}


/**
 * Show a 'popup window' with the options that were used to achieve the selected score.
 */
export function showPopupWindow( score: Score ) {
    const container = document.createElement( 'div' );
    const body = document.createElement( 'div' );
    const close = document.createElement( 'div' );

    body.innerHTML = `Food interval: ${score.options.foodInterval}<br />Double Food interval: ${score.options.doubleFoodInterval}`;
    close.innerText = 'Close';
    close.onclick = () => {
        document.body.removeChild( container );
    };

    container.appendChild( body );
    container.appendChild( close );

    document.body.appendChild( container );
}
