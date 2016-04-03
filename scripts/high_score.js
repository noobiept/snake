/*global AppStorage, Options, boolToOnOff*/

var HighScore;
(function (HighScore) {

    // has all the scores sorted descending order
var HIGH_SCORE = [];

   // number of scores to save (just save the best ones)
var HIGH_SCORE_LENGTH = 5;


/*
    Load from local storage
 */
HighScore.load = function( score )
{
if ( score )
    {
    HIGH_SCORE = score;
    }
};


/*
    Save to local storage
 */
HighScore.save = function()
{
AppStorage.setData({ snake_high_score: HIGH_SCORE });
};


HighScore.add = function( numberOfTails, time )
{
HIGH_SCORE.push({
    numberOfTails: numberOfTails,
    difficulty: Options.getDifficultyString(),
    frame: boolToOnOff( Options.getFrame() ),
    canvasWidth: Options.getCanvasWidth(),
    canvasHeight: Options.getCanvasHeight(),
    time: time
    });

HIGH_SCORE.sort( function(a, b)
    {
    return b.numberOfTails - a.numberOfTails;
    });

    // if we passed the limit, remove the last one (the lesser score)
if ( HIGH_SCORE.length > HIGH_SCORE_LENGTH )
    {
    HIGH_SCORE.pop();
    }
};


HighScore.getAll = function()
{
return HIGH_SCORE;
};


HighScore.get = function( position )
{
if ( position < 0 || position >= HIGH_SCORE.length )
    {
    return null;
    }

return HIGH_SCORE[ position ];
};


})(HighScore || (HighScore = {}));
