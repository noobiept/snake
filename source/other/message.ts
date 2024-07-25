/**
 * Show/hide a text message on the center of the screen.
 */
let ELEMENT: HTMLElement;

export function init() {
    ELEMENT = document.getElementById("Message")!;
}

export function show(text: string) {
    ELEMENT.innerHTML = text;
    ELEMENT.classList.remove("hidden");
}

export function hide() {
    ELEMENT.classList.add("hidden");
}
