import * as Options from './options.js';
import * as AppStorage from './app_storage.js';
import * as Game from './game.js';
import * as HighScore from './high_score.js';
import { MapName } from './main.js';
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

    container.style.display = 'block';
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
    // :: Width :: //

    var canvasWidth = Options.getCanvasWidth();
    var widthValue = document.getElementById( 'Options-width-value' ) as HTMLElement;
    var widthSlider = document.getElementById( 'Options-width-slider' ) as HTMLInputElement;

    // set the initial value
    widthValue.innerText = canvasWidth.toString();

    widthSlider.oninput = function () {
        const value = widthSlider.value;

        widthValue.innerText = value;
        Options.setCanvasWidth( parseInt( value, 10 ) );
    }

    // :: Height :: //

    var canvasHeight = Options.getCanvasHeight();
    var heightValue = document.getElementById( 'Options-height-value' ) as HTMLElement;
    var heightSlider = document.getElementById( 'Options-height-slider' ) as HTMLInputElement;

    // set the initial value
    heightValue.innerText = canvasHeight.toString();

    heightSlider.oninput = function () {
        const value = heightSlider.value;

        heightValue.innerText = value;
        Options.setCanvasHeight( parseInt( value, 10 ) );
    }

    // :: frame :: //

    var frame = document.getElementById( 'Options-frame' )!;
    var frameValue = frame.querySelector( 'span' )!;

    $( frameValue ).text( boolToOnOff( Options.getFrame() ) );

    frame.onclick = function () {
        if ( $( frameValue ).text() == 'On' ) {
            Options.setFrame( false );
        }

        else {
            Options.setFrame( true );
        }

        $( frameValue ).text( boolToOnOff( Options.getFrame() ) );
    };

    // :: difficulty :: //

    var difficulty = document.getElementById( 'Options-difficulty' )!;
    var difficultyValue = difficulty.querySelector( 'span' )!;

    $( difficultyValue ).text( Options.getDifficultyString() );

    difficulty.onclick = function () {
        if ( $( difficultyValue ).text() == 'normal' ) {
            $( difficultyValue ).text( 'hard' );

            Options.setDifficulty( Options.Difficulty.hard );
        }

        else {
            $( difficultyValue ).text( 'normal' );

            Options.setDifficulty( Options.Difficulty.normal );
        }
    };

    // :: back :: //

    var back = document.getElementById( 'Options-back' )!;

    back.onclick = function () {
        Options.save();
        open( 'mainMenu' );
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

        var header = [ 'Position', 'Number Of Tails', 'Difficulty', 'Frame', 'Canvas Width', 'Canvas Height', 'Time' ];
        var tableHeader;

        for ( var i = 0; i < header.length; i++ ) {
            tableHeader = document.createElement( 'th' );

            $( tableHeader ).text( header[ i ] );
            tableRow.appendChild( tableHeader );
        }

        table.appendChild( tableRow );

        var score;
        var position;
        var numberOfTails;
        var difficulty;
        var frame;
        var canvasWidthData;
        var canvasHeightData;
        var time;

        for ( i = 0; i < allScores.length; i++ ) {
            score = allScores[ i ];

            tableRow = document.createElement( 'tr' );
            position = document.createElement( 'td' );
            numberOfTails = document.createElement( 'td' );
            difficulty = document.createElement( 'td' );
            frame = document.createElement( 'td' );
            canvasWidthData = document.createElement( 'td' );
            canvasHeightData = document.createElement( 'td' );
            time = document.createElement( 'td' );

            $( position ).text( ( i + 1 ).toString() );
            $( numberOfTails ).text( score.numberOfTails );
            $( difficulty ).text( score.difficulty );
            $( frame ).text( score.frame );
            $( canvasWidthData ).text( score.canvasWidth );
            $( canvasHeightData ).text( score.canvasHeight );
            $( time ).text( score.time );

            tableRow.appendChild( position );
            tableRow.appendChild( numberOfTails );
            tableRow.appendChild( difficulty );
            tableRow.appendChild( frame );
            tableRow.appendChild( canvasWidthData );
            tableRow.appendChild( canvasHeightData );
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

        container.style.display = 'none';
    } );
}
