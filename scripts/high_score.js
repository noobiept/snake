var HighScore;
(function (HighScore) {
    var HIGH_SCORE = {};
    // number of scores to save (just save the best ones)
    var HIGH_SCORE_LENGTH = 5;
    /*
        Load from local storage
     */
    function load(score) {
        if (score) {
            // previous high-score data was an array with the scores
            // need to migrate the data to the current structure
            // the previous high-score were all on the 'random' map type (since that was the only map available)
            if (Array.isArray(score)) {
                var randomScores = score;
                HIGH_SCORE = {
                    'random': randomScores
                };
                save();
            }
            else {
                HIGH_SCORE = score;
            }
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
    function add(mapName, numberOfTails, time) {
        // the snake always has 1 tail, so only consider scores above that (where you actually played the game)
        if (numberOfTails <= 1) {
            return;
        }
        var scoreArray = HIGH_SCORE[mapName];
        if (typeof scoreArray === 'undefined') {
            scoreArray = [];
            HIGH_SCORE[mapName] = scoreArray;
        }
        scoreArray.push({
            numberOfTails: numberOfTails,
            difficulty: Options.getDifficultyString(),
            frame: boolToOnOff(Options.getFrame()),
            canvasWidth: Options.getCanvasWidth(),
            canvasHeight: Options.getCanvasHeight(),
            time: time
        });
        scoreArray.sort(function (a, b) {
            return b.numberOfTails - a.numberOfTails;
        });
        // if we passed the limit, remove the last one (the lesser score)
        if (scoreArray.length > HIGH_SCORE_LENGTH) {
            scoreArray.pop();
        }
    }
    HighScore.add = add;
    function getMapScores(mapName) {
        return HIGH_SCORE[mapName];
    }
    HighScore.getMapScores = getMapScores;
})(HighScore || (HighScore = {}));
//# sourceMappingURL=high_score.js.map