let ELEMENT: HTMLElement;


export function init() {
    ELEMENT = document.getElementById( 'Message' )!;
}


export function show( text: string ) {
    ELEMENT.innerText = text;
    ELEMENT.classList.remove( 'hidden' );
}

export function hide() {
    ELEMENT.classList.add( 'hidden' );
}
