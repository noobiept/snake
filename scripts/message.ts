interface MessageArgs
    {
    text: string;
    x?: number;
    y?: number;
    cssClass: string;
    }


class Message
{
private message: HTMLDivElement;


constructor( stuff: MessageArgs )
    {
    var message = <HTMLDivElement> document.querySelector( '#Message' );
    $( message ).html( stuff.text );

    if ( typeof stuff.x == 'undefined' )
        {
        centerElement( message );
        }

    else
        {
        $( message ).css( 'left', stuff.x + 'px' );
        $( message ).css( 'top', stuff.y + 'px' );
        }

    if ( typeof stuff.cssClass != 'undefined' )
        {
        $( message ).addClass( stuff.cssClass );
        }

    $( message ).css( 'display', 'block' );

    this.message = message;
    }


remove()
    {
    $( this.message ).css( 'display', 'none' );
    $( this.message ).removeClass();
    }
}




