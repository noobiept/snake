import Interval from './interval.js';
import { timeToString } from "./utilities.js";


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


    getMilliseconds() {
        return this.count;
    }


    restart() {
        this.count = 0;
        this.active = true;
        this.interval.reset();
    }


    getString() {
        return timeToString( this.count );
    }


    tick( delta: number ) {
        if ( this.active ) {
            this.count += delta;
            this.interval.tick( delta );
        }
    }
}
