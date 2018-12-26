/**
 * Use to run some code at a certain interval. It counts based on the given 'delta' time (time that passes between ticks).
 */
export default class Interval {
    private callback: () => any;
    private target: number;
    private count: number;


    constructor( callback: () => any, intervalTime: number ) {
        this.callback = callback;
        this.target = intervalTime;
        this.count = 0;
    }


    reset() {
        this.count = 0;
    }


    tick( delta: number ) {
        this.count += delta;

        if ( this.count >= this.target ) {
            this.count = 0;
            this.callback();
        }
    }
}
