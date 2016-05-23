var Options;
(function (Options) {
    var DIFFICULTY = {
        normal: 0,
        hard: 1
    };
    var DIFFICULTY_STRING = ['normal', 'hard'];
    var OPTIONS = {
        canvas_width: 800,
        canvas_height: 400,
        frameOn: false,
        difficulty: DIFFICULTY.normal
    };
    function load(options) {
        if (options) {
            if ($.isNumeric(options.canvas_width)) {
                OPTIONS.canvas_width = options.canvas_width;
            }
            if ($.isNumeric(options.canvas_height)) {
                OPTIONS.canvas_height = options.canvas_height;
            }
            if (typeof options.frameOn !== 'undefined') {
                OPTIONS.frameOn = options.frameOn;
            }
            if (typeof options.difficulty !== 'undefined') {
                OPTIONS.difficulty = options.difficulty;
            }
        }
    }
    Options.load = load;
    function save() {
        AppStorage.setData({ snake_options: OPTIONS });
    }
    Options.save = save;
    function setDifficulty(difficulty) {
        OPTIONS.difficulty = difficulty;
    }
    Options.setDifficulty = setDifficulty;
    function getDifficulty() {
        return OPTIONS.difficulty;
    }
    Options.getDifficulty = getDifficulty;
    function setDifficultyString(stringValue) {
        Options.setDifficulty(DIFFICULTY_STRING.indexOf(stringValue));
    }
    Options.setDifficultyString = setDifficultyString;
    function getDifficultyString() {
        return DIFFICULTY_STRING[OPTIONS.difficulty];
    }
    Options.getDifficultyString = getDifficultyString;
    function setCanvasWidth(width) {
        OPTIONS.canvas_width = width;
        CANVAS.width = width;
        centerCanvas();
    }
    Options.setCanvasWidth = setCanvasWidth;
    function getCanvasWidth() {
        return OPTIONS.canvas_width;
    }
    Options.getCanvasWidth = getCanvasWidth;
    function setCanvasHeight(height) {
        OPTIONS.canvas_height = height;
        CANVAS.height = height;
        centerCanvas();
    }
    Options.setCanvasHeight = setCanvasHeight;
    function getCanvasHeight() {
        return OPTIONS.canvas_height;
    }
    Options.getCanvasHeight = getCanvasHeight;
    function setFrame(yesNo) {
        OPTIONS.frameOn = yesNo;
    }
    Options.setFrame = setFrame;
    function getFrame() {
        return OPTIONS.frameOn;
    }
    Options.getFrame = getFrame;
})(Options || (Options = {}));
//# sourceMappingURL=options.js.map