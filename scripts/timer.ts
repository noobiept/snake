class Timer
{
private count: number;
private htmlElement: HTMLElement;
private interval: Interval;


constructor( htmlElement: HTMLElement )
    {
    var timerObject = this;

    $( htmlElement ).text( '0.0s' );

    this.count = 0;
    this.htmlElement = htmlElement;
    this.interval = new Interval( function()
        {
        timerObject.count += 100;

        $( timerObject.htmlElement ).text( ( timerObject.count / 1000 ).toFixed( 1 ) + 's' );

        }, 100 );
    }


start()
    {
    this.interval.start();
    }


stop()
    {
    this.interval.stop();
    }


getString()
    {
    return (this.count / 1000) + 's';
    }
}
