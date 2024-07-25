interface PopupWindowArgs {
    content: string;
    buttons: { text: string; onClick: () => void }[];
}

/**
 * Show a popup window on the center of the screen.
 */
export default class PopupWindow {
    private overlay: HTMLElement;
    private container: HTMLElement;

    constructor(args: PopupWindowArgs) {
        const overlay = document.createElement("div");
        overlay.className = "popupOverlay";

        const container = document.createElement("div");
        container.className = "popupWindow";

        const content = document.createElement("div");
        content.innerHTML = args.content;

        const buttons = document.createElement("div");
        buttons.className = "popupButtons";

        for (let a = 0; a < args.buttons.length; a++) {
            const buttonInfo = args.buttons[a];

            const button = document.createElement("div");
            button.className = "button";
            button.innerText = buttonInfo.text;
            button.onclick = buttonInfo.onClick;

            buttons.appendChild(button);
        }

        container.appendChild(content);
        container.appendChild(buttons);

        document.body.appendChild(overlay);
        document.body.appendChild(container);

        this.container = container;
        this.overlay = overlay;
    }

    remove() {
        document.body.removeChild(this.container);
        document.body.removeChild(this.overlay);
    }
}
