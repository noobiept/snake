import { MapName } from './main.js';
import { centerElement, boolToOnOff } from './utilities.js';
import * as Options from './options.js';
import * as AppStorage from './app_storage.js';


var MAIN_MENU: HTMLElement;
var OPTIONS: HTMLElement;
var HIGH_SCORE: HTMLElement;
var HELP: HTMLElement;
var SELECTED: HTMLElement | null = null;
var MAP_SELECTED: HTMLElement;


export function init( mapName?: string )
    {
    MAIN_MENU = <HTMLElement> document.querySelector( '#MainMenu' );
    OPTIONS = <HTMLElement> document.querySelector( '#Options' );
    HIGH_SCORE = <HTMLElement> document.querySelector( '#HighScore' );
    HELP = <HTMLElement> document.querySelector( '#Help' );

        // initialize the main menu elements
    var startGame = <HTMLElement> MAIN_MENU.querySelector( '#MainMenu-startGame' );
    var startGame_2players = <HTMLElement> MAIN_MENU.querySelector( '#MainMenu-startGame-2players' );
    var selectMap = <HTMLElement> document.getElementById( 'MainMenu-selectMap' );
    var options = <HTMLElement> MAIN_MENU.querySelector( '#MainMenu-options' );
    var highScore = <HTMLElement> MAIN_MENU.querySelector( '#MainMenu-highScore' );
    var help = <HTMLElement> MAIN_MENU.querySelector( '#MainMenu-help' );

    startGame.onclick = function()
        {
        clear();
        Game.start( <MapName> MAP_SELECTED.getAttribute( 'data-map' ), false );
        };

    startGame_2players.onclick = function()
        {
        clear();
        Game.start( <MapName> MAP_SELECTED.getAttribute( 'data-map' ), true );
        };

        // set the click event on all the map elements (to change to that map)
    for (let a = 0 ; a < selectMap.children.length ; a++)
        {
        let map = <HTMLElement> selectMap.children[ a ];

         map.onclick = function( event )
            {
            changeMap( map );
            };
        }

        // start with the given map selected
    if ( mapName )
        {
        changeMap( <HTMLElement> selectMap.querySelector( 'li[data-map="' + mapName + '"]' ), false );
        }

        // start with the first element selected
    else
        {
        changeMap( <HTMLElement> selectMap.firstElementChild, false );
        }

    options.onclick = function()
        {
        openOptions();
        };

    highScore.onclick = function()
        {
        openHighScore( <MapName> MAP_SELECTED.getAttribute( 'data-map' ) );
        };

    help.onclick = function()
        {
        openHelp();
        };
    }


export function openMainMenu()
    {
    clear();

    $( MAIN_MENU ).css( 'display', 'block' );

    SELECTED = MAIN_MENU;
    reCenter();
    }


function changeMap( element: HTMLElement, save= true )
    {
        // remove previous selection
    if ( MAP_SELECTED )
        {
        MAP_SELECTED.classList.remove( 'mapSelected' );
        }

    if ( save !== false )
        {
        AppStorage.setData({ 'snake_selected_map': element.getAttribute( 'data-map' ) });
        }

    element.classList.add( 'mapSelected' );
    MAP_SELECTED = element;
    }


export function openOptions()
    {
    clear();

        // :: Width :: //

    var width = OPTIONS.querySelector( '#Options-width' )!;
    var widthValue = width.querySelector( 'span' )!;

    var canvasWidth = Options.getCanvasWidth();

    $( widthValue ).text( canvasWidth );

    var widthSlider = width.querySelector( '#Options-width-slider' )!;

    $( widthSlider ).slider({
        min: 400,
        max: 1800,
        step: 100,
        value: canvasWidth,
        range: 'min',
        slide: function( event, ui )
            {
            $( widthValue ).text( ui.value! );

            Options.setCanvasWidth( ui.value! );
            reCenter();
            }
        });

        // :: Height :: //

    var height = OPTIONS.querySelector( '#Options-height' )!;
    var heightValue = height.querySelector( 'span' )!;

    var canvasHeight = Options.getCanvasHeight();

    $( heightValue ).text( canvasHeight );

    var heightSlider = height.querySelector( '#Options-height-slider' )!;

    $( heightSlider ).slider({
        min: 400,
        max: 1000,
        step: 100,
        value: canvasHeight,
        range: 'min',
        slide: function( event, ui )
            {
            $( heightValue ).text( ui.value! );

            Options.setCanvasHeight( ui.value! );
            reCenter();
            }
        });

        // :: frame :: //

    var frame = <HTMLElement> OPTIONS.querySelector( '#Options-frame' )!;
    var frameValue = frame.querySelector( 'span' )!;

    $( frameValue ).text( boolToOnOff( Options.getFrame() ) );

    frame.onclick = function()
        {
        if ( $( frameValue ).text() == 'On' )
            {
            Options.setFrame( false );
            }

        else
            {
            Options.setFrame( true );
            }

        $( frameValue ).text( boolToOnOff( Options.getFrame() ) );
        };

        // :: difficulty :: //

    var difficulty = <HTMLElement> OPTIONS.querySelector( '#Options-difficulty' )!;
    var difficultyValue = difficulty.querySelector( 'span' )!;

    $( difficultyValue ).text( Options.getDifficultyString() );

    difficulty.onclick = function()
        {
        if ( $( difficultyValue ).text() == 'normal' )
            {
            $( difficultyValue ).text( 'hard' );

            Options.setDifficulty( Options.Difficulty.hard );
            }

        else
            {
            $( difficultyValue ).text( 'normal' );

            Options.setDifficulty( Options.Difficulty.normal );
            }
        };

        // :: back :: //

    var back = <HTMLElement> OPTIONS.querySelector( '#Options-back' );

    back.onclick = function()
        {
        Options.save();
        openMainMenu();
        };

    $( OPTIONS ).css( 'display', 'block' );

    SELECTED = OPTIONS;
    reCenter();
    }


export function openHighScore( mapName: MapName )
    {
    clear();

    var title = document.getElementById( 'HighScoreTitle' )!;
    var table = HIGH_SCORE.querySelector( '#HighScore-table' )!;

    title.innerHTML = 'High score -- ' + mapName;

            // data
    var allScores = HighScore.getMapScores( mapName );

    if ( !allScores || allScores.length === 0 )
        {
        table.innerHTML = 'No score yet.';
        }

    else
        {
            // header
        var tableRow = document.createElement( 'tr' );

        var header = [ 'Position', 'Number Of Tails', 'Difficulty', 'Frame', 'Canvas Width', 'Canvas Height', 'Time' ];
        var tableHeader;

        for (var i = 0 ; i < header.length ; i++)
            {
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

        for (i = 0 ; i < allScores.length ; i++)
            {
            score = allScores[ i ];

            tableRow = document.createElement( 'tr' );
            position = document.createElement( 'td' );
            numberOfTails = document.createElement( 'td' );
            difficulty = document.createElement( 'td' );
            frame = document.createElement( 'td' );
            canvasWidthData = document.createElement( 'td' );
            canvasHeightData = document.createElement( 'td' );
            time = document.createElement( 'td' );

            $( position ).text( (i + 1).toString() );
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

    var back = <HTMLElement> HIGH_SCORE.querySelector( '#HighScore-back' );

    back.onclick = function()
        {
            // clean the table, otherwise if we return to the high-score page it will have repeated rows
        $( table ).empty();

        openMainMenu();
        };

    $( HIGH_SCORE ).css( 'display', 'block' );

    SELECTED = HIGH_SCORE;
    reCenter();
    }


export function openHelp()
    {
    clear();

        // this needs to be first, so that the calculations below work (on the other functions above this is executed at the end... doesn't really matter)
    $( HELP ).css( 'display', 'block' );

    SELECTED = HELP;
    reCenter();

    var back = <HTMLElement> HELP.querySelector( '#Help-back' );

    back.onclick = function()
        {
        openMainMenu();
        };
    }


function clear()
    {
    $( MAIN_MENU  ).css( 'display', 'none' );
    $( OPTIONS    ).css( 'display', 'none' );
    $( HIGH_SCORE ).css( 'display', 'none' );
    $( HELP       ).css( 'display', 'none' );
    }


export function reCenter()
    {
    if ( SELECTED )
        {
        centerElement( SELECTED );
        }
    }
