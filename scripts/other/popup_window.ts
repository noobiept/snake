interface PopupWindowArgs {
    content: string;
    closeText: string;
    onClose: () => void;
}


/**
 * Show a popup window on the center of the screen.
 */
export function show( args: PopupWindowArgs ) {
    const container = document.createElement( 'div' );
    container.className = 'popupWindow';

    const content = document.createElement( 'div' );
    content.innerHTML = args.content;

    const close = document.createElement( 'div' );
    close.className = 'button';
    close.innerText = args.closeText;

    container.appendChild( content );
    container.appendChild( close );

    document.body.appendChild( container );

    close.onclick = () => {
        document.body.removeChild( container );

        args.onClose();
    }
}
