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
var options = MAIN_MENU.querySelector( '#MainMenu-options' );
var highScore = MAIN_MENU.querySelector( '#MainMenu-highScore' );


startGame.onclick = function()
    {
    MainMenu.startGame();
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



MainMenu.startGame = function()
{
Game.start();
};


MainMenu.options = function()
{
clearCanvas();

};


MainMenu.highScore = function()
{
clearCanvas();


var table = HIGH_SCORE.querySelector( '#HighScore-table' );


    // header
var tableRow = document.createElement( 'tr' );

var header = [ 'Position', 'Number Of Tails' ];
var tableHeader;

for (var i = 0 ; i < header.length ; i++)
    {
    tableHeader = document.createElement( 'th' );

    tableHeader.innerText = header[ i ];
    tableRow.appendChild( tableHeader );
    }

table.appendChild( tableRow );

    // data
var allScores = HighScore.getAll();


var position;
var numberOfTails;

for (i = 0 ; i < allScores.length ; i++)
    {
    tableRow = document.createElement( 'tr' );
    position = document.createElement( 'td' );
    numberOfTails = document.createElement( 'td' );

    position.innerText = (i + 1).toString();
    numberOfTails.innerText = allScores[ i ];

    tableRow.appendChild( position );
    tableRow.appendChild( numberOfTails );
    table.appendChild( tableRow );
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