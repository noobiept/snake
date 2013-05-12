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

};





MainMenu.clear = function()
{
$( MAIN_MENU  ).css( 'display', 'none' );
$( OPTIONS    ).css( 'display', 'none' );
$( HIGH_SCORE ).css( 'display', 'none' );
};



window.MainMenu = MainMenu;

}(window));