import { Timeout, TimeoutArgs } from "../other/timeout";

const TIMEOUTS: Timeout[] = [];

/**
 * Add a new timeout to the game loop (so its able to count the time).
 */
export function addTimeout(args: TimeoutArgs) {
    const timeout = new Timeout(args);
    TIMEOUTS.push(timeout);
}

/**
 * Move forward all the timeouts.
 */
export function tick(delta: number) {
    for (let a = TIMEOUTS.length - 1; a >= 0; a--) {
        const timeout = TIMEOUTS[a];
        const over = timeout.tick(delta);

        if (over) {
            TIMEOUTS.splice(a, 1);
        }
    }
}

export function clear() {
    TIMEOUTS.length = 0;
}
