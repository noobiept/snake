var GameMenu;
(function (GameMenu) {
    var GAME_MENU;
    var PLAYERS_SCORE = [];
    var TIMER_ELEMENT;
    /**
     * Initialize the game menu.
     */
    function init() {
        GAME_MENU = document.getElementById('GameMenu');
        PLAYERS_SCORE[0] = document.getElementById('GameMenu-player1-score');
        PLAYERS_SCORE[1] = document.getElementById('GameMenu-player2-score');
        TIMER_ELEMENT = document.getElementById('GameMenu-timer');
        // :: Pause / Resume :: //
        var isPaused = false;
        var pauseResume = document.getElementById('GameMenu-pauseResume');
        pauseResume.onclick = function () {
            if (isPaused) {
                isPaused = false;
                $(pauseResume).text('Pause');
            }
            else {
                isPaused = true;
                $(pauseResume).text('Resume');
            }
            Game.pauseResume(isPaused);
        };
        // :: Quit :: //
        var quit = document.getElementById('GameMenu-quit');
        quit.onclick = function () {
            if (isPaused) {
                resume();
            }
            Game.clear();
            MainMenu.open();
        };
        GameMenu.reCenterGameMenu();
    }
    GameMenu.init = init;
    function show(twoPlayerMode) {
        var playerTwoScore = PLAYERS_SCORE[1].parentElement;
        if (twoPlayerMode) {
            playerTwoScore.style.display = 'inline-block';
        }
        else {
            playerTwoScore.style.display = 'none';
        }
        $(GAME_MENU).css('display', 'block');
    }
    GameMenu.show = show;
    function hide() {
        $('#GameMenu-pauseResume').text('Pause');
        $('#GameMenu').css('display', 'none');
        $('#GameMenu-player2-score').css('display', 'none');
    }
    GameMenu.hide = hide;
    function reCenterGameMenu() {
        var gameMenu = document.getElementById('GameMenu');
        // position the menu on the bottom right of the canvas
        var canvasPosition = $(CANVAS).position();
        var canvasWidth = Options.getCanvasWidth();
        //var left = canvasPosition.left + Options.getCanvasWidth() - $( gameMenu ).width();
        var left = canvasPosition.left;
        var top = canvasPosition.top + Options.getCanvasHeight();
        $(gameMenu).css('top', top + 'px');
        $(gameMenu).css('left', left + 'px');
        $(gameMenu).css('width', canvasWidth + 'px'); // have to set the menu's width, so that the left/right sub-menus really go to their position
    }
    GameMenu.reCenterGameMenu = reCenterGameMenu;
    function updateScore(playerPosition, score) {
        PLAYERS_SCORE[playerPosition].innerHTML = score.toString();
    }
    GameMenu.updateScore = updateScore;
    function updateTimer(timer) {
        $(TIMER_ELEMENT).text((timer.getCount() / 1000).toFixed(1) + 's');
    }
    GameMenu.updateTimer = updateTimer;
})(GameMenu || (GameMenu = {}));
