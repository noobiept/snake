import Food from "./food.js";


export class Apple extends Food {
    constructor() {
        super( {
            assetName: 'apple',
            eaten: { tails: 1 }
        } );
    }
}


export class Orange extends Food {
    constructor() {
        super( {
            assetName: 'orange',
            eaten: { tails: 2 }
        } );
    }
}


export class Banana extends Food {
    constructor() {
        super( {
            assetName: 'banana',
            eaten: {
                tails: 1,
                speed: {
                    multiplier: 2,
                    duration: 2000
                }
            }
        } );
    }
}
