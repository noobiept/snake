(function(window)
{
function Message( text, x, y )
{
var message = document.querySelector( '#Message' );

message.innerText = text;


if ( typeof x == 'undefined' )
    {
    centerElement( message );
    }

else
    {
    $( message ).css( 'left', x + 'px' );
    $( message ).css( 'top', y + 'px' );
    }


$( message ).css( 'display', 'block' );

this.message = message;
}


Message.prototype.remove = function()
{
$( this.message ).css( 'display', 'none' );
}



window.Message = Message;



}(window));
