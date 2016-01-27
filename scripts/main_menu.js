(function(window)
{
function MainMenu()
{

}

var MAIN_MENU;
var OPTIONS;
var HIGH_SCORE;
var HELP;


MainMenu.init = function()
{
MAIN_MENU = document.querySelector( '#MainMenu' );
OPTIONS = document.querySelector( '#Options' );
HIGH_SCORE = document.querySelector( '#HighScore' );
HELP = document.querySelector( '#Help' );
};


MainMenu.open = function()
{
clearCanvas();


var startGame = MAIN_MENU.querySelector( '#MainMenu-startGame' );
var startGame_2players = MAIN_MENU.querySelector( '#MainMenu-startGame-2players' );
var options = MAIN_MENU.querySelector( '#MainMenu-options' );
var highScore = MAIN_MENU.querySelector( '#MainMenu-highScore' );
var help = MAIN_MENU.querySelector( '#MainMenu-help' );


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

help.onclick = function()
    {
    MainMenu.help();
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

$( widthValue ).text( canvasWidth );

var widthSlider = width.querySelector( '#Options-width-slider' );

$( widthSlider ).slider({
    min: 400,
    max: 1800,
    step: 100,
    value: canvasWidth,
    range: 'min',
    slide: function( event, ui )
        {
        $( widthValue ).text( ui.value );

        Options.setCanvasWidth( ui.value );

        centerElement( OPTIONS );
        }
    });


    // :: Height :: //

var height = OPTIONS.querySelector( '#Options-height' );
var heightValue = height.querySelector( 'span' );

var canvasHeight = Options.getCanvasHeight();

$( heightValue ).text( canvasHeight );

var heightSlider = height.querySelector( '#Options-height-slider' );

$( heightSlider ).slider({
    min: 400,
    max: 1000,
    step: 100,
    value: canvasHeight,
    range: 'min',
    slide: function( event, ui )
        {
        $( heightValue ).text( ui.value );

        Options.setCanvasHeight( ui.value );

        centerElement( OPTIONS );
        }
    });


    // :: frame :: //

var frame = OPTIONS.querySelector( '#Options-frame' );
var frameValue = frame.querySelector( 'span' );

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

var difficulty = OPTIONS.querySelector( '#Options-difficulty' );

var difficultyValue = difficulty.querySelector( 'span' );


$( difficultyValue ).text( Options.getDifficultyString() );

difficulty.onclick = function()
    {
    if ( $( difficultyValue ).text() == 'normal' )
        {
        $( difficultyValue ).text( 'hard' );

        Options.setDifficultyString( 'hard' );
        }

    else
        {
        $( difficultyValue ).text( 'normal' );

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



MainMenu.help = function()
{
clearCanvas();

    // this needs to be first, so that the calculations below work (on the other functions above this is executed at the end... doesn't really matter)
$( HELP ).css( 'display', 'block' );

centerElement( HELP );


    // show the game element next to its description
var foodHelp = HELP.querySelector( '#Help-food' );
var doubleFoodHelp = HELP.querySelector( '#Help-doubleFood' );
var wallHelp = HELP.querySelector( '#Help-wall' );


    // need to get the position of the html element (offset is relative  to the document)
var canvasPosition = $( CANVAS ).offset();
var foodPosition = $ ( foodHelp ).offset();
var doubleFoodPosition = $( doubleFoodHelp ).offset();
var wallPosition = $( wallHelp ).offset();

    // distance away from the description
var xDistance = 50;

    // determine where to position the elements
var x = foodPosition.left - canvasPosition.left - xDistance;
var y = foodPosition.top - canvasPosition.top + FOOD_HEIGHT;

var food = new Food( x, y );

x = doubleFoodPosition.left - canvasPosition.left - xDistance;
y = doubleFoodPosition.top - canvasPosition.top + FOOD_HEIGHT;

var double_food = new DoubleFood( x, y );

x = wallPosition.left - canvasPosition.left - xDistance;
y = wallPosition.top - canvasPosition.top + 10;

var wall = new Wall( x, y, 20, 7 );


var back = HELP.querySelector( '#Help-back' );

back.onclick = function()
    {
        // don't forget to remove everything
    food.remove();
    double_food.remove();
    wall.remove();

    MainMenu.open();
    };
};






MainMenu.clear = function()
{
$( MAIN_MENU  ).css( 'display', 'none' );
$( OPTIONS    ).css( 'display', 'none' );
$( HIGH_SCORE ).css( 'display', 'none' );
$( HELP       ).css( 'display', 'none' );
};



window.MainMenu = MainMenu;

}(window));
