import * as Options from './options.js';
import { updateCanvasDimensions } from './main.js';
import { boolToOnOff } from './utilities.js';
import { open } from './main_menu.js';


/**
 * Initialize the 'options' page components.
 */
export function initOptions() {

    // canvas options
    const columns = setupRangeSetting( 'columns', 'Columns', 20, 100, 5, '', updateCanvasDimensions );
    const lines = setupRangeSetting( 'lines', 'Lines', 20, 100, 5, '', updateCanvasDimensions );
    const frame = setupBooleanSetting( 'frameOn', 'Frame: ' );

    const canvasOptions = document.getElementById( 'Options-Canvas' )!;
    canvasOptions.appendChild( columns );
    canvasOptions.appendChild( lines );
    canvasOptions.appendChild( frame );

    // snake options
    const speed = setupRangeSetting( 'snakeSpeed', 'Speed', 10, 100, 10, 'Hz' );

    const snakeOptions = document.getElementById( 'Options-Snake' )!;
    snakeOptions.appendChild( speed );

    // maps options
    const wall = setupRangeSetting( 'wallInterval', '<img src="images/wall_help.png" /> <em>Wall</em> spawn interval', 500, 5000, 500, 'ms' );
    const food = setupRangeSetting( 'foodInterval', '<img src="images/red_apple_10px.png" /> <em>Food</em> spawn interval', 500, 5000, 500, 'ms' );
    const doubleFood = setupRangeSetting( 'doubleFoodInterval', '<img src="images/orange_10px.png" /> <em>Double food</em> spawn interval', 500, 5000, 500, 'ms' );

    const mapsOptions = document.getElementById( 'Options-Maps' )!;
    mapsOptions.appendChild( wall );
    mapsOptions.appendChild( food );
    mapsOptions.appendChild( doubleFood );

    // setup the 'back' button
    var back = document.getElementById( 'Options-Back' )!;

    back.onclick = function () {
        Options.save();
        open( 'mainMenu' );
    };
}


/**
 * Return a range setting component to be used to change a game setting (the number of columns, the snake speed, etc).
 */
function setupRangeSetting( option: Options.OptionsKey, displayHtml: string, min: number, max: number, step: number, displayUnit?: string, onChange?: () => void ) {
    const currentValue = Options.get( option ).toString();

    const setting = document.createElement( 'div' );
    setting.className = 'Options-rangeSetting';

    const display = document.createElement( 'span' );
    display.innerHTML = displayHtml;

    const valueContainer = document.createElement( 'span' );

    const value = document.createElement( 'span' );
    value.className = 'displayValue Options-value';
    value.innerText = currentValue;

    const unit = document.createElement( 'span' );
    unit.innerText = ` ${displayUnit || ''}`;

    const range = document.createElement( 'input' );
    range.type = 'range';
    range.className = 'Options-rangeInput';
    range.min = min.toString();
    range.max = max.toString();
    range.step = step.toString();
    range.value = currentValue;

    range.oninput = function () {
        const rangeValue = range.value;

        value.innerText = rangeValue;
        Options.set( option, parseInt( rangeValue, 10 ) );

        if ( onChange ) {
            onChange();
        }
    }

    // append everything
    valueContainer.appendChild( value );
    valueContainer.appendChild( unit );

    setting.appendChild( display );
    setting.appendChild( valueContainer );
    setting.appendChild( range );

    return setting;
}


/**
 * Returns a boolean setting component (to control the game frame, etc).
 */
function setupBooleanSetting( option: Options.KeysOfType<Options.OptionsData, boolean>, displayHtml: string ) {
    const currentValue = Options.get( option );

    const setting = document.createElement( 'div' );
    setting.className = 'button';

    const display = document.createElement( 'span' );
    display.innerHTML = displayHtml;

    const value = document.createElement( 'span' );
    value.innerText = boolToOnOff( currentValue );

    setting.onclick = function () {
        let next;

        if ( value.innerText === 'On' ) {
            next = false;
        }

        else {
            next = true;
        }

        Options.set( option, next );
        value.innerText = boolToOnOff( next );
    }

    setting.appendChild( display );
    setting.appendChild( value );

    return setting;
}
