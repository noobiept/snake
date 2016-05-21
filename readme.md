Try it out here: [http://nbpt.eu/games/snake/](http://nbpt.eu/games/snake/)


Brief Description
=================


At a certain interval (depending on the difficulty set), some elements will be added to the map.

- `Obstacles` (walls), that you need to avoid.
- `Food`, that you need to get, to grow the snake's tail.

The snake can't hit its own tail, or the obstacles, otherwise the game is over.

The snake is controlled with the `wasd` keys for player 1, and the `arrow` keys for player 2.
You can only control the next direction to turn, can't reverse the snake's direction.

In the options menu, you can change the difficulty of the game by changing some parameters, like the canvas width/height, whether there's a frame around the canvas, and the the spawn timings.


Dependencies
============

- typescript -- 1.8
- typings -- 1.0

- jquery -- 2.2
- jquery-ui -- 1.11
    - slider
    - blitzer theme
- createjs
    - easeljs -- 0.8
    - preloadjs -- 0.6
