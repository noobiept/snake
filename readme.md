# Links

-   [http://nbpt.eu/games/snake/](http://nbpt.eu/games/snake/)
-   [chrome store](https://chrome.google.com/webstore/detail/snake-game/pihfccclbpikjeecdehncecpmkggndjn)

# Brief Description

The classic snake game experience, with several maps to choose from and two player mode.

Maps description:

-   `Empty`: Clear map without any walls.
-   `Random`: Starts with an empty map, and adds walls randomly in the map at a certain interval.
-   `Random Diagonal`: Similar to `random` but adds diagonal walls randomly in the map.
-   `Random Single`: Similar to `random` but adds single position walls randomly in the map.
-   `Stairs`: Stair like walls added at the start.
-   `Lines`: Horizontal walls added at the start.

At a certain interval (depending on what is set on the options), some elements will be added to the map.

-   `Obstacles` (walls), that you need to avoid (only for the random maps).
-   `Food`, that you need to get to grow the snake's tail.
    -   `Apple`: Adds 1 tail.
    -   `Orange`: Adds 2 tails.
    -   `Banana`: Adds 1 tail and momentarily increases the snake speed.

The snake can't hit its own tail, or the obstacles, otherwise the game is over.

The snake is controlled with the `wasd` keys for player 1, and the `arrow` keys for player 2. If playing with only 1 player, then either of the controls can be used.

You can only control the next direction to turn, can't reverse the snake's direction.

In the options menu, you can change some parameters of the game, like the canvas size, whether there's a frame around the canvas, the spawn timings, etc. These apply to any map.

The high-score menu shows the scores of the selected map. To see the scores of the other maps just select the map in the main menu before opening the high-score menu.

# Development

-   `npm run dev` (run the typescript compiler on watch mode and a development server with the game on `http://localhost:8000/`)
-   `npm run build` (build the release version of the game to the `/release/` directory)

# Images

-   https://opengameart.org/content/banana
