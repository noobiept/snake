let GAME_MENU: HTMLElement;
const PLAYERS_SCORE: HTMLElement[] = [];
let TIMER_ELEMENT: HTMLElement;

export type GameMenuInitArgs = {
    onQuit: () => void;
    togglePause: () => boolean;
};

/**
 * Initialize the game menu.
 */
export function init({ onQuit, togglePause }: GameMenuInitArgs) {
    GAME_MENU = document.getElementById("GameMenu")!;
    PLAYERS_SCORE[0] = document.getElementById("GameMenu-Player1-Score")!;
    PLAYERS_SCORE[1] = document.getElementById("GameMenu-Player2-Score")!;
    TIMER_ELEMENT = document.getElementById("GameMenu-Timer")!;

    // :: Pause / Resume :: //

    const pauseResume = <HTMLDivElement>(
        document.getElementById("GameMenu-PauseResume")
    );
    pauseResume.onclick = function () {
        const paused = togglePause();
        if (paused) {
            pauseResume.innerText = "Resume";
        } else {
            pauseResume.innerText = "Pause";
        }
    };

    // :: Quit :: //

    const quit = <HTMLDivElement>document.getElementById("GameMenu-Quit");
    quit.onclick = onQuit;
}

/**
 * Show the game menu.
 */
export function show(twoPlayerMode: boolean) {
    const playerTwoScore = PLAYERS_SCORE[1].parentElement!;

    if (twoPlayerMode) {
        playerTwoScore.classList.remove("hidden");
    } else {
        playerTwoScore.classList.add("hidden");
    }

    GAME_MENU.classList.remove("hidden");
}

/**
 * Reset the menu and hide it.
 */
export function clear() {
    const pauseResume = document.getElementById("GameMenu-PauseResume")!;
    pauseResume.innerText = "Pause";

    GAME_MENU.classList.add("hidden");
}

/**
 * Update the score in the game menu.
 */
export function updateScore(playerPosition: number, score: number) {
    PLAYERS_SCORE[playerPosition].innerHTML = score.toString();
}

/**
 * Update the timer value on the game menu.
 */
export function updateTimer(time: string) {
    TIMER_ELEMENT.innerText = time;
}
