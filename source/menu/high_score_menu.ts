import { getMapScores, Score } from "../storage/high_score.js";
import {
    joinAndCapitalize,
    splitCamelCaseWords,
    boolToOnOff,
    timeToString,
} from "../other/utilities.js";
import { open } from "./main_menu.js";
import type { MapName } from "../types.js";

let CURRENT_SCORE: Score | undefined; // associated 'score' of the current opened window
let CURRENT_BUTTON: HTMLElement | undefined; // associated 'info button' of the opened window (so we can add/remove style to it)

/**
 * Initialize the high-score menu page.
 */
export function initHighScore() {
    const back = document.getElementById("HighScore-Back")!;

    back.onclick = function () {
        hideInfoWindow();
        open("mainMenu");
    };
}

/**
 * Build the top scores table to show on the 'high-score' page.
 */
export function buildHighScoreTable(mapName: MapName) {
    const title = document.getElementById("HighScore-Title")!;
    const table = document.getElementById("HighScore-Table")!;

    const displayName = joinAndCapitalize(splitCamelCaseWords(mapName));

    table.innerHTML = ""; // clear the previous table
    title.innerHTML = `High score (${displayName})`;

    // data
    const allScores = getMapScores(mapName);

    if (!allScores || allScores.length === 0) {
        table.innerHTML = "No score yet.";
    } else {
        // header
        const tableRow = document.createElement("tr");
        const header = ["Position", "Number Of Tails", "Time"];

        for (let i = 0; i < header.length; i++) {
            const tableHeader = document.createElement("th");

            tableHeader.innerText = header[i];
            tableRow.appendChild(tableHeader);
        }

        table.appendChild(tableRow);

        for (let i = 0; i < allScores.length; i++) {
            const score = allScores[i];

            const tableRow = document.createElement("tr");
            const position = document.createElement("td");
            const numberOfTails = document.createElement("td");
            const time = document.createElement("td");
            const info = document.createElement("td");

            info.innerText = "Info";
            info.className = "button";

            position.innerText = (i + 1).toString();
            numberOfTails.innerText = score.numberOfTails.toString();
            time.innerText = timeToString(score.time) + "s";
            info.onclick = function () {
                showInfoWindow(score, info);
            };

            tableRow.appendChild(position);
            tableRow.appendChild(numberOfTails);
            tableRow.appendChild(time);
            tableRow.append(info);
            table.appendChild(tableRow);
        }
    }
}

/**
 * Show a 'popup window' with the options that were used to achieve the selected score.
 */
function showInfoWindow(score: Score, button: HTMLElement) {
    const container = document.getElementById("HighScore-Info")!;
    const options = score.options;

    // close the window
    if (CURRENT_SCORE === score) {
        hideInfoWindow();
        return;
    }

    clearCurrent();

    // save some references to the current opened info window
    CURRENT_SCORE = score;
    CURRENT_BUTTON = button;

    // clear the 'info' window
    container.innerHTML = "";

    const body = document.createElement("div");
    const close = document.createElement("div");

    addInfoValue(body, "Tails: ", score.numberOfTails);
    addInfoValue(body, "Time: ", timeToString(score.time), "s");
    addInfoValue(body, "Columns: ", options.columns);
    addInfoValue(body, "Lines: ", options.lines);
    addInfoValue(body, "Frame: ", boolToOnOff(options.frameOn));
    addInfoValue(body, "Apple interval: ", options.appleInterval, "ms");
    addInfoValue(body, "Orange interval: ", options.orangeInterval, "ms");
    addInfoValue(body, "Banana interval: ", options.bananaInterval, "ms");
    addInfoValue(body, "Wall interval: ", options.wallInterval, "ms");
    addInfoValue(body, "Snake speed: ", options.snakeSpeed, "Hz");

    close.className = "button backButton";
    close.innerText = "Close";
    close.onclick = () => {
        hideInfoWindow();
    };

    container.appendChild(body);
    container.appendChild(close);

    // show the window
    container.classList.remove("hidden");

    // style the 'info' button
    button.classList.add("HighScore-selectedInfo");
}

/**
 * Hide the 'info' window.
 */
function hideInfoWindow() {
    const container = document.getElementById("HighScore-Info")!;
    container.classList.add("hidden");

    clearCurrent();
}

/**
 * Clear the current saved values (of the button/score).
 */
function clearCurrent() {
    if (CURRENT_BUTTON) {
        CURRENT_BUTTON.classList.remove("HighScore-selectedInfo");
    }

    CURRENT_BUTTON = undefined;
    CURRENT_SCORE = undefined;
}

/**
 * Show the text, then the value and add that to the container.
 */
function addInfoValue(
    container: HTMLElement,
    text: string,
    value: string | number,
    unit?: string
) {
    const textElement = document.createElement("div");
    textElement.innerText = text;

    const valueElement = document.createElement("span");
    valueElement.className = "displayValue";
    valueElement.innerText = value.toString();

    const unitElement = document.createElement("span");
    if (unit) {
        unitElement.innerText = ` ${unit}`;
    }

    textElement.appendChild(valueElement);
    textElement.appendChild(unitElement);
    container.append(textElement);
}
