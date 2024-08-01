import Food from "./food";

export class Apple extends Food {
    constructor() {
        super({
            assetName: "apple",
            eaten: { tails: 1 },
        });
    }
}

export class Orange extends Food {
    constructor() {
        super({
            assetName: "orange",
            eaten: { tails: 2 },
        });
    }
}

export class Banana extends Food {
    constructor() {
        super({
            assetName: "banana",
            eaten: {
                tails: 1,
                speed: {
                    multiplier: 1.5,
                    duration: 2000,
                },
            },
        });
    }
}
