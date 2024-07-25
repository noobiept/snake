import Interval from "./interval.js";
import { timeToString } from "./utilities.js";

/**
 * Counts the time that has passed since the start.
 */
export default class Timer {
    private count: number;
    private interval: Interval;
    private active: boolean;

    constructor(timeElapsed: (time: string) => void) {
        this.active = false;
        this.count = 0;
        this.interval = new Interval({
            callback: () => {
                timeElapsed(this.getString());
            },
            interval: 100,
        });
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
        return timeToString(this.count);
    }

    tick(delta: number) {
        if (this.active) {
            this.count += delta;
            this.interval.tick(delta);
        }
    }
}
