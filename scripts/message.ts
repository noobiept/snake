interface MessageArgs {
    text: string;
    cssClass?: string;
}


export default class Message {
    private message: HTMLDivElement;


    constructor( stuff: MessageArgs ) {
        var message = <HTMLDivElement> document.querySelector( '#Message' );
        message.innerHTML = stuff.text;

        if ( typeof stuff.cssClass != 'undefined' ) {
            message.classList.add( stuff.cssClass );
        }

        message.classList.remove( 'hidden' );

        this.message = message;
    }


    remove() {
        // clear all other css classes and hide the element
        this.message.className = 'hidden';
    }
}
