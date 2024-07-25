import * as Game from './game.js';


var GAME_MENU: HTMLElement;
var PLAYERS_SCORE: HTMLElement[] = [];
var TIMER_ELEMENT: HTMLElement;


/**
 * Initialize the game menu.
 */
export function init() {
    GAME_MENU = document.getElementById( 'GameMenu' )!;
    PLAYERS_SCORE[ 0 ] = document.getElementById( 'GameMenu-Player1-Score' )!;
    PLAYERS_SCORE[ 1 ] = document.getElementById( 'GameMenu-Player2-Score' )!;
    TIMER_ELEMENT = document.getElementById( 'GameMenu-Timer' )!;

    // :: Pause / Resume :: //

    var pauseResume = <HTMLDivElement> document.getElementById( 'GameMenu-PauseResume' );
    pauseResume.onclick = function () {
        togglePause( pauseResume );
    };

    // :: Quit :: //

    var quit = <HTMLDivElement> document.getElementById( 'GameMenu-Quit' );
    quit.onclick = function () {
        // don't allow to mess with the menu when game is over
        if ( Game.isGameOver() ) {
            return;
        }

        Game.quit();
    };
}


/**
 * Show the game menu.
 */
export function show( twoPlayerMode: boolean ) {
    var playerTwoScore = PLAYERS_SCORE[ 1 ].parentElement!;

    if ( twoPlayerMode ) {
        playerTwoScore.classList.remove( 'hidden' )
    }

    else {
        playerTwoScore.classList.add( 'hidden' );
    }

    GAME_MENU.classList.remove( 'hidden' );
}


/**
 * Reset the menu and hide it.
 */
export function clear() {
    const pauseResume = document.getElementById( 'GameMenu-PauseResume' )!;
    pauseResume.innerText = 'Pause';

    GAME_MENU.classList.add( 'hidden' );
}


/**
 * Update the score in the game menu.
 */
export function updateScore( playerPosition: number, score: number ) {
    PLAYERS_SCORE[ playerPosition ].innerHTML = score.toString();
}


/**
 * Update the timer value on the game menu.
 */
export function updateTimer( time: string ) {
    TIMER_ELEMENT.innerText = time;
}


/**
 * Pause/resume the game.
 */
function togglePause( htmlElement: HTMLElement ) {
    // don't allow to mess with the menu when game is over
    if ( Game.isGameOver() ) {
        return;
    }

    const paused = !Game.isPaused();
    if ( paused ) {
        htmlElement.innerText = 'Resume';
    }

    else {
        htmlElement.innerText = 'Pause';
    }

    Game.pauseResume( paused );
}
