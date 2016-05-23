var Timer = (function () {
    function Timer(timeElapsed) {
        var timerObject = this;
        this.count = 0;
        this.interval = new Interval(function () {
            timerObject.count += 100;
            timeElapsed(timerObject);
        }, 100);
    }
    Timer.prototype.start = function () {
        this.interval.start();
    };
    Timer.prototype.stop = function () {
        this.interval.stop();
    };
    Timer.prototype.getCount = function () {
        return this.count;
    };
    Timer.prototype.restart = function () {
        this.stop();
        this.count = 0;
        this.start();
    };
    Timer.prototype.getString = function () {
        return (this.count / 1000) + 's';
    };
    return Timer;
}());
//# sourceMappingURL=timer.js.map