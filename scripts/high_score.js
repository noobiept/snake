(function(window)
{
function HighScore()
{

}

    // has all the scores sorted descending order
var HIGH_SCORE = [];

   // number of scores to save (just save the best ones)
var HIGH_SCORE_LENGTH = 5;

/*
    Load from localStorage
 */

HighScore.load = function()
{
var score = localStorage.getObject( 'high_score' );

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
localStorage.setObject( 'high_score', HIGH_SCORE );
};




HighScore.add = function( newScore )
{
HIGH_SCORE.push( newScore );

HIGH_SCORE.sort( function(a, b)
    {
    return b - a;
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



window.HighScore = HighScore;

}(window));