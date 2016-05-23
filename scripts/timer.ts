class Timer
{
private count: number;
private htmlElement: HTMLElement;
private interval: Interval;


constructor( timeElapsed: (timer: Timer) => any )
    {
    var timerObject = this;

    this.count = 0;
    this.interval = new Interval( function()
        {
        timerObject.count += 100;
        timeElapsed( timerObject );
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


getCount()
    {
    return this.count;
    }


restart()
    {
    this.stop();
    this.count = 0;
    this.start();
    }


getString()
    {
    return (this.count / 1000) + 's';
    }
}
