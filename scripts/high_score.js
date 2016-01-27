var HighScore;
(function (HighScore) {

    // has all the scores sorted descending order
var HIGH_SCORE = [];

   // number of scores to save (just save the best ones)
var HIGH_SCORE_LENGTH = 5;


/*
    Load from localStorage
 */
HighScore.load = function()
{
var score = localStorage.getObject( 'snake_high_score' );

if ( score !== null )
    {
    HIGH_SCORE = score;
    }
};


/*
    Save to localStorage
 */
HighScore.save = function()
{
localStorage.setObject( 'snake_high_score', HIGH_SCORE );
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


HighScore.removeAll = function()
{
HIGH_SCORE.length = 0;

localStorage.removeItem( 'snake_high_score' );
};


})(HighScore || (HighScore = {}));
