import * as Options from './options.js';
import * as AppStorage from './app_storage.js';
import * as Game from './game.js';
import * as HighScore from './high_score.js';
import { MapName, updateCanvasDimensions } from './main.js';
import { boolToOnOff } from './utilities.js';


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
        MAP_SELECTED.classList.remove( 'mapSelected' );
    }

    if ( save !== false ) {
        AppStorage.setData( { 'snake_selected_map': element.getAttribute( 'data-map' ) } );
    }

    element.classList.add( 'mapSelected' );
    MAP_SELECTED = element;
}


function initMainMenu( mapName?: string ) {

    // initialize the main menu elements
    var startGame = document.getElementById( 'MainMenu-startGame' )!;
    var startGame_2players = document.getElementById( 'MainMenu-startGame-2players' )!;
    var selectMap = document.getElementById( 'MainMenu-selectMap' )!;
    var options = document.getElementById( 'MainMenu-options' )!;
    var highScore = document.getElementById( 'MainMenu-highScore' )!;
    var help = document.getElementById( 'MainMenu-help' )!;

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


function initOptions() {

    // setup the range settings
    setupRangeSetting( 'columns', updateCanvasDimensions );
    setupRangeSetting( 'lines', updateCanvasDimensions );
    setupRangeSetting( 'snakeSpeed' );
    setupRangeSetting( 'wallInterval' );
    setupRangeSetting( 'foodInterval' );
    setupRangeSetting( 'doubleFoodInterval' );

    // setup the 'frameOn' setting (on/off setting)
    var frame = document.getElementById( 'Options-frame' )!;
    var frameValue = document.getElementById( 'Options-frame-value' )!;

    frameValue.innerText = boolToOnOff( Options.get( 'frameOn' ) );

    frame.onclick = function () {
        if ( frameValue.innerText === 'On' ) {
            Options.set( 'frameOn', false );
        }

        else {
            Options.set( 'frameOn', true );
        }

        frameValue.innerText = boolToOnOff( Options.get( 'frameOn' ) );
    };

    // setup the 'back' button
    var back = document.getElementById( 'Options-back' )!;

    back.onclick = function () {
        Options.save();
        open( 'mainMenu' );
    };
}


/**
 * Setup the UI elements of a range setting from the options page (to be used to change the number of columns, the snake speed, etc).
 */
function setupRangeSetting( option: Options.OptionsKey, onChange?: () => void ) {
    const currentValue = Options.get( option ).toString();
    const elementValue = document.getElementById( `Options-${option}-value` ) as HTMLElement;
    const elementRange = document.getElementById( `Options-${option}-range` ) as HTMLInputElement;

    // set the initial value
    elementValue.innerText = currentValue;
    elementRange.value = currentValue;

    elementRange.oninput = function () {
        const value = elementRange.value;

        elementValue.innerText = value;
        Options.set( option, parseInt( value, 10 ) );

        if ( onChange ) {
            onChange();
        }
    };
}



function initHighScore() {
    var back = document.getElementById( 'HighScore-back' )!;

    back.onclick = function () {
        open( 'mainMenu' );
    };
}


function initHelp() {
    var back = document.getElementById( 'Help-back' )!;

    back.onclick = function () {
        open( 'mainMenu' );
    };
}


function buildHighScoreTable( mapName: MapName ) {
    var title = document.getElementById( 'HighScoreTitle' )!;
    var table = document.getElementById( 'HighScore-table' )!;

    table.innerHTML = '';   // clear the previous table
    title.innerHTML = 'High score -- ' + mapName;

    // data
    var allScores = HighScore.getMapScores( mapName );

    if ( !allScores || allScores.length === 0 ) {
        table.innerHTML = 'No score yet.';
    }

    else {
        // header
        var tableRow = document.createElement( 'tr' );

        var header = [ 'Position', 'Number Of Tails', 'Frame', 'Columns', 'Lines', 'Time' ];
        var tableHeader;

        for ( var i = 0; i < header.length; i++ ) {
            tableHeader = document.createElement( 'th' );

            tableHeader.innerText = header[ i ];
            tableRow.appendChild( tableHeader );
        }

        table.appendChild( tableRow );

        var score;
        var position;
        var numberOfTails;
        var frame;
        var columns;
        var lines;
        var time;

        for ( i = 0; i < allScores.length; i++ ) {
            score = allScores[ i ];

            tableRow = document.createElement( 'tr' );
            position = document.createElement( 'td' );
            numberOfTails = document.createElement( 'td' );
            frame = document.createElement( 'td' );
            columns = document.createElement( 'td' );
            lines = document.createElement( 'td' );
            time = document.createElement( 'td' );

            position.innerText = ( i + 1 ).toString();
            numberOfTails.innerText = score.numberOfTails.toString();
            frame.innerText = score.frame;
            columns.innerText = score.columns.toString();
            lines.innerText = score.lines.toString();
            time.innerText = score.time;

            tableRow.appendChild( position );
            tableRow.appendChild( numberOfTails );
            tableRow.appendChild( frame );
            tableRow.appendChild( columns );
            tableRow.appendChild( lines );
            tableRow.appendChild( time );
            table.appendChild( tableRow );
        }
    }
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
