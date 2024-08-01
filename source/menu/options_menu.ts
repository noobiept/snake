import * as Options from "../storage/options.js";
import { boolToOnOff } from "../other/utilities.js";
import { updateCanvasDimensions } from "../game/canvas.js";
import type {
    KeysOfType,
    OptionsData,
    OptionsKey,
} from "../storage/storage.types.js";

interface RangeArgs {
    option: OptionsKey;
    displayHtml: string;
    displayUnit?: string;
    min: number;
    max: number;
    step: number;
    onChange?: () => void;
}

interface BooleanArgs {
    option: KeysOfType<OptionsData, boolean>;
    displayHtml: string;
}

export type InitOptionsArgs = {
    onBack: () => void;
};

/**
 * Initialize the 'options' page components.
 */
export function initOptions({ onBack }: InitOptionsArgs) {
    // canvas options
    const columns = setupRangeSetting({
        option: "columns",
        displayHtml: "Columns",
        min: 20,
        max: 100,
        step: 5,
        onChange: updateCanvasDimensions,
    });
    const lines = setupRangeSetting({
        option: "lines",
        displayHtml: "Lines",
        min: 20,
        max: 100,
        step: 5,
        onChange: updateCanvasDimensions,
    });
    const frame = setupBooleanSetting({
        option: "frameOn",
        displayHtml: "Frame: ",
    });

    const canvasOptions = document.getElementById("Options-Canvas")!;
    canvasOptions.appendChild(columns);
    canvasOptions.appendChild(lines);
    canvasOptions.appendChild(frame);

    // snake options
    const speed = setupRangeSetting({
        option: "snakeSpeed",
        displayHtml: "Speed",
        displayUnit: "Hz",
        min: 10,
        max: 100,
        step: 10,
    });

    const snakeOptions = document.getElementById("Options-Snake")!;
    snakeOptions.appendChild(speed);

    // maps options
    const wall = setupRangeSetting({
        option: "wallInterval",
        displayHtml:
            '<img src="images/wall_help.png" /> <em>Wall</em> spawn interval',
        displayUnit: "ms",
        min: 500,
        max: 5000,
        step: 500,
    });
    const apple = setupRangeSetting({
        option: "appleInterval",
        displayHtml:
            '<img src="images/red_apple_10px.png" /> <em>Apple</em> spawn interval',
        displayUnit: "ms",
        min: 500,
        max: 5000,
        step: 500,
    });
    const orange = setupRangeSetting({
        option: "orangeInterval",
        displayHtml:
            '<img src="images/orange_10px.png" /> <em>Orange</em> spawn interval',
        displayUnit: "ms",
        min: 500,
        max: 5000,
        step: 500,
    });
    const banana = setupRangeSetting({
        option: "bananaInterval",
        displayHtml:
            '<img src="images/banana_10px.png" /> <em>Banana</em> spawn interval',
        displayUnit: "ms",
        min: 500,
        max: 5000,
        step: 500,
    });

    const mapsOptions = document.getElementById("Options-Maps")!;
    mapsOptions.appendChild(wall);
    mapsOptions.appendChild(apple);
    mapsOptions.appendChild(orange);
    mapsOptions.appendChild(banana);

    // setup the 'back' button
    const back = document.getElementById("Options-Back")!;

    back.onclick = function () {
        Options.save();
        onBack();
    };
}

/**
 * Return a range setting component to be used to change a game setting (the number of columns, the snake speed, etc).
 */
function setupRangeSetting(args: RangeArgs) {
    const currentValue = Options.get(args.option).toString();

    const setting = document.createElement("div");
    setting.className = "Options-rangeSetting";

    const display = document.createElement("span");
    display.innerHTML = args.displayHtml;

    const valueContainer = document.createElement("span");

    const value = document.createElement("span");
    value.className = "displayValue Options-value";
    value.innerText = currentValue;

    const unit = document.createElement("span");
    unit.innerText = ` ${args.displayUnit || ""}`;

    const range = document.createElement("input");
    range.type = "range";
    range.className = "Options-rangeInput";
    range.min = args.min.toString();
    range.max = args.max.toString();
    range.step = args.step.toString();
    range.value = currentValue;

    range.oninput = function () {
        const rangeValue = range.value;

        value.innerText = rangeValue;
        Options.set(args.option, parseInt(rangeValue, 10));

        if (args.onChange) {
            args.onChange();
        }
    };

    // append everything
    valueContainer.appendChild(value);
    valueContainer.appendChild(unit);

    setting.appendChild(display);
    setting.appendChild(valueContainer);
    setting.appendChild(range);

    return setting;
}

/**
 * Returns a boolean setting component (to control the game frame, etc).
 */
function setupBooleanSetting(args: BooleanArgs) {
    const currentValue = Options.get(args.option);

    const setting = document.createElement("div");
    setting.className = "button";

    const display = document.createElement("span");
    display.innerHTML = args.displayHtml;

    const value = document.createElement("span");
    value.innerText = boolToOnOff(currentValue);

    setting.onclick = function () {
        let next;

        if (value.innerText === "On") {
            next = false;
        } else {
            next = true;
        }

        Options.set(args.option, next);
        value.innerText = boolToOnOff(next);
    };

    setting.appendChild(display);
    setting.appendChild(value);

    return setting;
}
