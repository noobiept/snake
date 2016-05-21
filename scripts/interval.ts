class Interval
{
private what_to_call: () => any;
private interval_time: number;
private is_on: boolean;
private interval_id: number;


constructor( what_to_call: () => any, interval_time: number )
    {
    this.what_to_call = what_to_call;
    this.interval_time = interval_time;
    this.is_on = false;

    this.start();
    }


start()
    {
    this.interval_id = window.setInterval( this.what_to_call, this.interval_time );

    this.is_on = true;
    }


stop()
    {
    window.clearInterval( this.interval_id );

    this.is_on = false;
    }


isOn()
    {
    return this.is_on;
    }
}
