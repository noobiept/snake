import Interval from './interval.js';


export default class Timer {
    private count: number;
    private interval: Interval;
    private active: boolean;


    constructor( timeElapsed: ( time: string ) => any ) {
        this.active = false;
        this.count = 0;
        this.interval = new Interval( () => {
            timeElapsed( this.getString() );
        }, 100 );
    }


    start() {
        this.active = true;
    }


    stop() {
        this.active = false;
    }


    getCount() {
        return this.count;
    }


    restart() {
        this.count = 0;
        this.active = true;
        this.interval.reset();
    }


    getString() {
        return ( this.count / 1000 ).toFixed( 1 ) + 's';
    }


    tick( delta: number ) {
        if ( this.active ) {
            this.count += delta;
            this.interval.tick( delta );
        }
    }
}
