/*global Options, CANVAS*/
/*exported EVENT_KEY, isNextTo, checkCollision, getRandomInt, getRandomFloat, checkOverflowPosition, centerElement, INHERIT_PROTOTYPE, boolToOnOff*/

/*
 * Keys code for the keyboard events
 */

var EVENT_KEY = {

    backspace  : 8,
    tab        : 9,
    enter      : 13,
    esc        : 27,
    space      : 32,
    end        : 35,
    home       : 36,
    leftArrow  : 37,
    upArrow    : 38,
    rightArrow : 39,
    downArrow  : 40,
    del        : 46,

    "0" : 48,
    "1" : 49,
    "2" : 50,
    "3" : 51,
    "4" : 52,
    "5" : 53,
    "6" : 54,
    "7" : 55,
    "8" : 56,
    "9" : 57,

    a : 65,
    b : 66,
    c : 67,
    d : 68,
    e : 69,
    f : 70,
    g : 71,
    h : 72,
    i : 73,
    j : 74,
    k : 75,
    l : 76,
    m : 77,
    n : 78,
    o : 79,
    p : 80,
    q : 81,
    r : 82,
    s : 83,
    t : 84,
    u : 85,
    v : 86,
    w : 87,
    x : 88,
    y : 89,
    z : 90,

    f1  : 112,
    f2  : 113,
    f3  : 114,
    f4  : 115,
    f5  : 116,
    f6  : 117,
    f7  : 118,
    f8  : 119,
    f9  : 120,
    f10 : 121,
    f11 : 122,
    f12 : 123

};


/*
    Checks if a x/y position is within a range around other x/y position
*/
function isNextTo( x, y, targetX, targetY, range )
{
    // we make a 'box' with the target position and the range
var boxLeft = targetX - range / 2;
var boxRight = targetX + range / 2;

var boxTop = targetY - range / 2;
var boxBottom = targetY + range / 2;

if ( x >= boxLeft && x <= boxRight && y >= boxTop && y <= boxBottom )
    {
    return true;
    }

else
    {
    return false;
    }
}


function checkCollision( oneX, oneY, oneWidth, oneHeight, twoX, twoY, twoWidth, twoHeight )
{
    // calculate the position of the corners of the object (as a rectangle)
    // the position origin of the objects is in the center
var oneLeft = oneX - oneWidth / 2;
var oneRight = oneX + oneWidth / 2;
var oneTop = oneY - oneHeight / 2;
var oneBottom = oneY + oneHeight / 2;

var twoLeft = twoX - twoWidth / 2;
var twoRight = twoX + twoWidth / 2;
var twoTop = twoY - twoHeight / 2;
var twoBottom = twoY + twoHeight / 2;

if ( oneRight >= twoLeft && oneLeft <= twoRight && oneTop <= twoBottom && oneBottom >= twoTop )
    {
    return true;
    }

return false;
}


function getRandomInt( min, max )
{
return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomFloat( min, max )
{
return Math.random() * (max - min) + min;
}


/*
    If an x/y position is out of bounds, it overflows (goes to the other side of the canvas, the amount it overflows)
 */
function checkOverflowPosition( x_or_y, limit )
{
if ( x_or_y < 0 )
    {
    x_or_y = limit - -x_or_y;
    }

else if ( x_or_y > limit )
    {
    x_or_y -= limit;
    }

return x_or_y;
}


/*
    Centers an html element in the middle of the game canvas (assumes html element has its css position: absolute;
 */
function centerElement( element )
{
var canvasWidth = Options.getCanvasWidth();
var canvasHeight = Options.getCanvasHeight();

    // the canvas may not be starting at 0,0 position, so we need to account for that
var canvasPosition = $( CANVAS ).position();

var left = canvasWidth / 2 - $( element ).width() / 2 + canvasPosition.left;

var top = canvasHeight / 2 - $( element ).height() / 2 + canvasPosition.top;

$( element ).css({
    top  : top  + 'px',
    left : left + 'px'
    });
}


/*
 * Used for 'class' inheritance (search prototypal inheritance)
 */
function OBJECT( o )
{
function F(){}

F.prototype = o;

return new F();
}


/*
 * Used for 'class' inheritance (search for parasitic combination inheritance)
 */
function INHERIT_PROTOTYPE( derivedClass, baseClass )
{
var prototype = OBJECT( baseClass.prototype );

prototype.constructor = derivedClass;

derivedClass.prototype = prototype;
}


function boolToOnOff( value )
{
if ( value == true )
    {
    return 'On';
    }

else
    {
    return 'Off';
    }
}
