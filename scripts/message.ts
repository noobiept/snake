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

        $( message ).css( 'display', 'block' );

        this.message = message;
    }


    remove() {
        $( this.message ).css( 'display', 'none' );
        $( this.message ).removeClass();
    }
}




