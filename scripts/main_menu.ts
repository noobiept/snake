import * as Options from './options.js';
import * as AppStorage from './app_storage.js';
import * as Game from './game.js';
import { MapName, updateCanvasDimensions } from './main.js';
import { boolToOnOff } from './utilities.js';
import { buildHighScoreTable, hideInfoWindow } from "./high_score_menu.js";


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


/**
 * Initialize the 'options' page components.
 */
function initOptions() {

    // canvas options
    const columns = setupRangeSetting( 'columns', 'Columns', 20, 100, 5, '', updateCanvasDimensions );
    const lines = setupRangeSetting( 'lines', 'Lines', 20, 100, 5, '', updateCanvasDimensions );
    const frame = setupBooleanSetting( 'frameOn', 'Frame: ' );

    const canvasOptions = document.getElementById( 'Options-Canvas' )!;
    canvasOptions.appendChild( columns );
    canvasOptions.appendChild( lines );
    canvasOptions.appendChild( frame );

    // snake options
    const speed = setupRangeSetting( 'snakeSpeed', 'Speed', 10, 100, 10, 'Hz' );

    const snakeOptions = document.getElementById( 'Options-Snake' )!;
    snakeOptions.appendChild( speed );

    // maps options
    const wall = setupRangeSetting( 'wallInterval', '<img src="images/wall_help.png" /> <em>Wall</em> spawn interval', 500, 5000, 500, 'ms' );
    const food = setupRangeSetting( 'foodInterval', '<img src="images/red_apple_10px.png" /> <em>Food</em> spawn interval', 500, 5000, 500, 'ms' );
    const doubleFood = setupRangeSetting( 'doubleFoodInterval', '<img src="images/orange_10px.png" /> <em>Double food</em> spawn interval', 500, 5000, 500, 'ms' );

    const mapsOptions = document.getElementById( 'Options-Maps' )!;
    mapsOptions.appendChild( wall );
    mapsOptions.appendChild( food );
    mapsOptions.appendChild( doubleFood );

    // setup the 'back' button
    var back = document.getElementById( 'Options-Back' )!;

    back.onclick = function () {
        Options.save();
        open( 'mainMenu' );
    };
}


/**
 * Return a range setting component to be used to change a game setting (the number of columns, the snake speed, etc).
 */
function setupRangeSetting( option: Options.OptionsKey, displayHtml: string, min: number, max: number, step: number, displayUnit?: string, onChange?: () => void ) {
    const currentValue = Options.get( option ).toString();

    const setting = document.createElement( 'div' );
    setting.className = 'Options-rangeSetting';

    const display = document.createElement( 'span' );
    display.innerHTML = displayHtml;

    const valueContainer = document.createElement( 'span' );

    const value = document.createElement( 'span' );
    value.className = 'displayValue Options-value';
    value.innerText = currentValue;

    const unit = document.createElement( 'span' );
    unit.innerText = ` ${displayUnit || ''}`;

    const range = document.createElement( 'input' );
    range.type = 'range';
    range.className = 'Options-rangeInput';
    range.min = min.toString();
    range.max = max.toString();
    range.step = step.toString();
    range.value = currentValue;

    range.oninput = function () {
        const rangeValue = range.value;

        value.innerText = rangeValue;
        Options.set( option, parseInt( rangeValue, 10 ) );

        if ( onChange ) {
            onChange();
        }
    }

    // append everything
    valueContainer.appendChild( value );
    valueContainer.appendChild( unit );

    setting.appendChild( display );
    setting.appendChild( valueContainer );
    setting.appendChild( range );

    return setting;
}


/**
 * Returns a boolean setting component (to control the game frame, etc).
 */
function setupBooleanSetting( option: Options.KeysOfType<Options.OptionsData, boolean>, displayHtml: string ) {
    const currentValue = Options.get( option );

    const setting = document.createElement( 'div' );
    setting.className = 'button';

    const display = document.createElement( 'span' );
    display.innerHTML = displayHtml;

    const value = document.createElement( 'span' );
    value.innerText = boolToOnOff( currentValue );

    setting.onclick = function () {
        let next;

        if ( value.innerText === 'On' ) {
            next = false;
        }

        else {
            next = true;
        }

        Options.set( option, next );
        value.innerText = boolToOnOff( next );
    }

    setting.appendChild( display );
    setting.appendChild( value );

    return setting;
}


function initHighScore() {
    var back = document.getElementById( 'HighScore-Back' )!;

    back.onclick = function () {
        hideInfoWindow();
        open( 'mainMenu' );
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
