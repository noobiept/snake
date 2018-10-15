import * as Game from './game.js';


var GAME_MENU: HTMLElement;
var PLAYERS_SCORE: HTMLElement[] = [];
var TIMER_ELEMENT: HTMLElement;
var IS_PAUSED = false;


/**
 * Initialize the game menu.
 */
export function init() {
    GAME_MENU = document.getElementById( 'GameMenu' )!;
    PLAYERS_SCORE[ 0 ] = document.getElementById( 'GameMenu-player1-score' )!;
    PLAYERS_SCORE[ 1 ] = document.getElementById( 'GameMenu-player2-score' )!;
    TIMER_ELEMENT = document.getElementById( 'GameMenu-timer' )!;

    // :: Pause / Resume :: //

    var pauseResume = <HTMLDivElement> document.getElementById( 'GameMenu-pauseResume' );
    pauseResume.onclick = function () {
        togglePause( pauseResume );
    };

    // :: Quit :: //

    var quit = <HTMLDivElement> document.getElementById( 'GameMenu-quit' );
    quit.onclick = function () {
        // don't allow to mess with the menu when game is over
        if ( Game.isGameOver() ) {
            return;
        }

        Game.quit();
    };
}


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


export function clear() {
    const pauseResume = document.getElementById( 'GameMenu-pauseResume' )!;
    pauseResume.innerText = 'Pause';

    IS_PAUSED = false;

    GAME_MENU.classList.add( 'hidden' );
}


export function updateScore( playerPosition: number, score: number ) {
    PLAYERS_SCORE[ playerPosition ].innerHTML = score.toString();
}


export function updateTimer( time: string ) {
    TIMER_ELEMENT.innerText = time;
}


function togglePause( htmlElement: HTMLElement ) {
    // don't allow to mess with the menu when game is over
    if ( Game.isGameOver() ) {
        return;
    }

    if ( IS_PAUSED ) {
        IS_PAUSED = false;
        htmlElement.innerText = 'Pause';
    }

    else {
        IS_PAUSED = true;
        htmlElement.innerText = 'Resume';
    }

    Game.pauseResume( IS_PAUSED );
}
