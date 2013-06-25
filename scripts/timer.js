(function(window)
{
function Timer( htmlElement )
{
var timerObject = this;

this.count = 0;

$( htmlElement ).text( '0.0s' );


this.interval = new Interval( function()
    {
    timerObject.count += 100;

    $( timerObject.htmlElement ).text( ( timerObject.count / 1000 ).toFixed( 1 ) + 's' );

    }, 100 );

this.htmlElement = htmlElement;
}



Timer.prototype.start = function()
{
this.interval.start();
};



Timer.prototype.stop = function()
{
this.interval.stop();
};




Timer.prototype.getString = function()
{
return (this.count / 1000) + 's';
};


window.Timer = Timer;

}(window));
