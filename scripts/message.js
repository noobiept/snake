(function(window)
{
/*
    Argument:
        {
            text: string,
            x: number,
            y: number,
            cssClass: string
        }
 */

function Message( stuff )
{
var message = document.querySelector( '#Message' );

message.innerText = stuff.text;


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


Message.prototype.remove = function()
{
$( this.message ).css( 'display', 'none' );

$( this.message ).removeClass();
};



window.Message = Message;



}(window));
