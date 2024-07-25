interface IntervalArgs {
    callback: () => void;
    interval: number | (() => number);
}

/**
 * Use to run some code at a certain interval. It counts based on the given 'delta' time (time that passes between ticks).
 */
export default class Interval {
    private callback: () => any;
    private target: number | (() => number);
    private count: number;

    constructor(args: IntervalArgs) {
        this.callback = args.callback;
        this.target = args.interval;
        this.count = 0;
    }

    reset() {
        this.count = 0;
    }

    /**
     * The target is either a fixed number, or a function that returns a number (and thus can be changed at any time).
     */
    getTarget() {
        if (typeof this.target === "number") {
            return this.target;
        } else {
            return this.target();
        }
    }

    tick(delta: number) {
        this.count += delta;

        if (this.count >= this.getTarget()) {
            this.count = 0;
            this.callback();
        }
    }
}
