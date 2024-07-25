const ASSETS = {
    orange: "./images/orange_10px.png",
    apple: "./images/red_apple_10px.png",
    banana: "./images/banana_10px.png",
};

export type AssetName = keyof typeof ASSETS;

interface Loaded {
    [key: string]: HTMLImageElement;
}

const LOADED: Loaded = {};

/**
 * Preload the images/etc used in the program.
 */
export function init(onComplete: () => void) {
    const keys = Object.keys(ASSETS);
    const total = keys.length;
    let count = 0;

    for (let a = 0; a < total; a++) {
        const key = keys[a] as AssetName;
        const value = ASSETS[key];
        const image = new Image();

        const url = new URL(value, location.href);

        image.src = url.href;
        image.onload = () => {
            LOADED[key] = image;

            // check if we finished loading everything
            count++;

            if (count >= total) {
                onComplete();
            }
        };
    }
}

/**
 * Returns an asset that was pre-loaded.
 */
export function getAsset(name: AssetName) {
    return LOADED[name];
}
