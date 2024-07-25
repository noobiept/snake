export interface TimeoutArgs {
    callback: () => void;
    duration: number;
}

/**
 * Call the given 'callback' function after a certain time has passed.
 */
export default class Timeout {
    private callback: () => void;
    private duration: number;
    private count: number;

    constructor(args: TimeoutArgs) {
        this.callback = args.callback;
        this.duration = args.duration;
        this.count = 0;
    }

    /**
     * Advances the timeout. Returns 'true' if it has reached the target duration.
     */
    tick(delta: number) {
        this.count += delta;

        if (this.count >= this.duration) {
            this.callback();
            return true;
        }

        return false;
    }
}
