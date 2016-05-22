var HighScore;
(function (HighScore) {
    // has all the scores sorted descending order
    var HIGH_SCORE = [];
    // number of scores to save (just save the best ones)
    var HIGH_SCORE_LENGTH = 5;
    /*
        Load from local storage
     */
    function load(score) {
        if (score) {
            HIGH_SCORE = score;
        }
    }
    HighScore.load = load;
    /*
        Save to local storage
     */
    function save() {
        AppStorage.setData({ snake_high_score: HIGH_SCORE });
    }
    HighScore.save = save;
    function add(numberOfTails, time) {
        HIGH_SCORE.push({
            numberOfTails: numberOfTails,
            difficulty: Options.getDifficultyString(),
            frame: boolToOnOff(Options.getFrame()),
            canvasWidth: Options.getCanvasWidth(),
            canvasHeight: Options.getCanvasHeight(),
            time: time
        });
        HIGH_SCORE.sort(function (a, b) {
            return b.numberOfTails - a.numberOfTails;
        });
        // if we passed the limit, remove the last one (the lesser score)
        if (HIGH_SCORE.length > HIGH_SCORE_LENGTH) {
            HIGH_SCORE.pop();
        }
    }
    HighScore.add = add;
    function getAll() {
        return HIGH_SCORE;
    }
    HighScore.getAll = getAll;
    function get(position) {
        if (position < 0 || position >= HIGH_SCORE.length) {
            return null;
        }
        return HIGH_SCORE[position];
    }
    HighScore.get = get;
})(HighScore || (HighScore = {}));
