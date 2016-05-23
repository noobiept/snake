var Interval = (function () {
    function Interval(what_to_call, interval_time) {
        this.what_to_call = what_to_call;
        this.interval_time = interval_time;
        this.is_on = false;
        this.start();
    }
    Interval.prototype.start = function () {
        this.interval_id = window.setInterval(this.what_to_call, this.interval_time);
        this.is_on = true;
    };
    Interval.prototype.stop = function () {
        window.clearInterval(this.interval_id);
        this.is_on = false;
    };
    Interval.prototype.isOn = function () {
        return this.is_on;
    };
    return Interval;
}());
//# sourceMappingURL=interval.js.map