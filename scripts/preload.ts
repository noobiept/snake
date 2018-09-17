type AssetName = 'orange' | 'apple';


// used to access preloaded assets (images/etc)
var PRELOAD: createjs.LoadQueue;


export function init( onComplete: () => void ) {
    // preload the images/etc used in the program
    PRELOAD = new createjs.LoadQueue( true );

    PRELOAD.loadManifest( [
        { id: 'orange', src: 'images/orange_10px.png' },
        { id: 'apple', src: 'images/red_apple_10px.png' }
    ] );

    PRELOAD.addEventListener( 'complete', onComplete );
}


/**
 * Returns an asset that was pre-loaded.
 */
export function getAsset( name: AssetName ) {
    return PRELOAD.getResult( name ) as HTMLImageElement;
}
