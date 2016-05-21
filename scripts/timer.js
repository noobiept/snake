var Timer = (function () {
    function Timer(htmlElement) {
        var timerObject = this;
        $(htmlElement).text('0.0s');
        this.count = 0;
        this.htmlElement = htmlElement;
        this.interval = new Interval(function () {
            timerObject.count += 100;
            $(timerObject.htmlElement).text((timerObject.count / 1000).toFixed(1) + 's');
        }, 100);
    }
    Timer.prototype.start = function () {
        this.interval.start();
    };
    Timer.prototype.stop = function () {
        this.interval.stop();
    };
    Timer.prototype.getString = function () {
        return (this.count / 1000) + 's';
    };
    return Timer;
}());
