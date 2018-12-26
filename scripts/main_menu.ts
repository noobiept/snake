import * as AppStorage from './app_storage.js';
import * as Game from './game.js';
import { MapName } from './main.js';
import { buildHighScoreTable, initHighScore } from "./high_score_menu.js";
import { initOptions } from "./options_menu.js";


var MAP_SELECTED: HTMLElement;

interface Pages {
    mainMenu: HTMLElement;
    options: HTMLElement;
    highScore: HTMLElement;
    help: HTMLElement;
}

let PAGES: Pages;


export function init( mapName?: string ) {
    PAGES = {
        mainMenu: document.getElementById( 'MainMenu' )!,
        options: document.getElementById( 'Options' )!,
        highScore: document.getElementById( 'HighScore' )!,
        help: document.getElementById( 'Help' )!
    };

    initMainMenu( mapName );
    initOptions();
    initHighScore();
    initHelp();
}


/**
 * Open a page from the main menu.
 */
export function open( page: keyof Pages ) {
    const container = PAGES[ page ];

    clear();

    container.classList.remove( 'hidden' );
}


function changeMap( element: HTMLElement, save = true ) {
    // remove previous selection
    if ( MAP_SELECTED ) {
        MAP_SELECTED.classList.remove( 'MainMenu-mapSelected' );
    }

    if ( save !== false ) {
        AppStorage.setData( { 'snake_selected_map': element.getAttribute( 'data-map' ) } );
    }

    element.classList.add( 'MainMenu-mapSelected' );
    MAP_SELECTED = element;
}


function initMainMenu( mapName?: string ) {

    // initialize the main menu elements
    var startGame = document.getElementById( 'MainMenu-StartGame' )!;
    var startGame_2players = document.getElementById( 'MainMenu-StartGame-2players' )!;
    var selectMap = document.getElementById( 'MainMenu-SelectMap' )!;
    var options = document.getElementById( 'MainMenu-Options' )!;
    var highScore = document.getElementById( 'MainMenu-HighScore' )!;
    var help = document.getElementById( 'MainMenu-Help' )!;

    startGame.onclick = function () {
        clear();
        Game.start( <MapName> MAP_SELECTED.getAttribute( 'data-map' ), false );
    };

    startGame_2players.onclick = function () {
        clear();
        Game.start( <MapName> MAP_SELECTED.getAttribute( 'data-map' ), true );
    };

    // set the click event on all the map elements (to change to that map)
    for ( let a = 0; a < selectMap.children.length; a++ ) {
        let map = <HTMLElement> selectMap.children[ a ];

        map.onclick = function ( event ) {
            changeMap( map );
        };
    }

    // start with the given map selected
    if ( mapName ) {
        changeMap( <HTMLElement> selectMap.querySelector( 'li[data-map="' + mapName + '"]' ), false );
    }

    // start with the first element selected
    else {
        changeMap( <HTMLElement> selectMap.firstElementChild, false );
    }

    options.onclick = function () {
        open( 'options' );
    };

    highScore.onclick = function () {
        buildHighScoreTable( <MapName> MAP_SELECTED.getAttribute( 'data-map' ) );
        open( 'highScore' );
    };

    help.onclick = function () {
        open( 'help' );
    };
}


function initHelp() {
    var back = document.getElementById( 'Help-Back' )!;

    back.onclick = function () {
        open( 'mainMenu' );
    };
}


/**
 * Hide all the menu pages.
 */
function clear() {
    const keys = Object.keys( PAGES ) as ( keyof Pages )[];

    keys.map( ( key ) => {
        const container = PAGES[ key ];

        container.classList.add( 'hidden' );
    } );
}
