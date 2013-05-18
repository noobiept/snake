(function(window)
{
function MainMenu()
{

}

var MAIN_MENU;
var OPTIONS;
var HIGH_SCORE;


MainMenu.init = function()
{
MAIN_MENU = document.querySelector( '#MainMenu' );
OPTIONS = document.querySelector( '#Options' );
HIGH_SCORE = document.querySelector( '#HighScore' );
};


MainMenu.open = function()
{
clearCanvas();


var startGame = MAIN_MENU.querySelector( '#MainMenu-startGame' );
var startGame_2players = MAIN_MENU.querySelector( '#MainMenu-startGame-2players' );
var options = MAIN_MENU.querySelector( '#MainMenu-options' );
var highScore = MAIN_MENU.querySelector( '#MainMenu-highScore' );


startGame.onclick = function()
    {
    MainMenu.startGame();
    };


startGame_2players.onclick = function()
    {
    MainMenu.startGame( true );
    };



options.onclick = function()
    {
    MainMenu.options();
    };


highScore.onclick = function()
    {
    MainMenu.highScore();
    };


$( MAIN_MENU ).css( 'display', 'block' );

centerElement( MAIN_MENU );
};



MainMenu.startGame = function( twoPlayers )
{
Game.start( twoPlayers );
};


MainMenu.options = function()
{
clearCanvas();

    // :: Width :: //

var width = OPTIONS.querySelector( '#Options-width' );
var widthValue = width.querySelector( 'span' );

var canvasWidth = Options.getCanvasWidth();

widthValue.innerText = canvasWidth;

var widthSlider = width.querySelector( '#Options-width-slider' );

$( widthSlider ).slider({
    min: 400,
    max: 1000,
    step: 100,
    value: canvasWidth,
    range: 'min',
    slide: function( event, ui )
        {
        widthValue.innerText = ui.value;

        Options.setCanvasWidth( ui.value );

        centerElement( OPTIONS );
        }
    });


    // :: Height :: //

var height = OPTIONS.querySelector( '#Options-height' );
var heightValue = height.querySelector( 'span' );

var canvasHeight = Options.getCanvasHeight();

heightValue.innerText = canvasHeight;

var heightSlider = height.querySelector( '#Options-height-slider' );

$( heightSlider ).slider({
    min: 400,
    max: 1000,
    step: 100,
    value: canvasHeight,
    range: 'min',
    slide: function( event, ui )
        {
        heightValue.innerText = ui.value;

        Options.setCanvasHeight( ui.value );

        centerElement( OPTIONS );
        }
    });


    // :: frame :: //

var frame = OPTIONS.querySelector( '#Options-frame' );
var frameValue = frame.querySelector( 'span' );

frameValue.innerText = boolToOnOff( Options.getFrame() );

frame.onclick = function()
    {
    if ( frameValue.innerText == 'On' )
        {
        Options.setFrame( false );
        }

    else
        {
        Options.setFrame( true );
        }

    frameValue.innerText = boolToOnOff( Options.getFrame() );
    };


    // :: difficulty :: //

var difficulty = OPTIONS.querySelector( '#Options-difficulty' );

var difficultyValue = difficulty.querySelector( 'span' );


difficultyValue.innerText = Options.getDifficultyString();

difficulty.onclick = function()
    {
    if ( difficultyValue.innerText == 'normal' )
        {
        difficultyValue.innerText = 'hard';

        Options.setDifficultyString( 'hard' );
        }

    else
        {
        difficultyValue.innerText = 'normal';

        Options.setDifficultyString( 'normal' );
        }
    };



    // :: back :: //

var back = OPTIONS.querySelector( '#Options-back' );

back.onclick = function()
    {
    MainMenu.open();
    };


$( OPTIONS ).css( 'display', 'block' );

centerElement( OPTIONS );
};


MainMenu.highScore = function()
{
clearCanvas();


var table = HIGH_SCORE.querySelector( '#HighScore-table' );



        // data
var allScores = HighScore.getAll();

if ( allScores.length == 0 )
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

        tableHeader.innerText = header[ i ];
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

        position.innerText = (i + 1).toString();
        numberOfTails.innerText = score.numberOfTails;
        difficulty.innerText = score.difficulty;
        frame.innerText = score.frame;
        canvasWidthData.innerText = score.canvasWidth;
        canvasHeightData.innerText = score.canvasHeight;
        time.innerText = score.time;

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



var back = HIGH_SCORE.querySelector( '#HighScore-back' );

back.onclick = function()
    {
        // clean the table, otherwise if we return to the high-score page it will have repeated rows
    $( table ).empty();

    MainMenu.open();
    };


$( HIGH_SCORE ).css( 'display', 'block' );

centerElement( HIGH_SCORE );
};





MainMenu.clear = function()
{
$( MAIN_MENU  ).css( 'display', 'none' );
$( OPTIONS    ).css( 'display', 'none' );
$( HIGH_SCORE ).css( 'display', 'none' );
};



window.MainMenu = MainMenu;

}(window));