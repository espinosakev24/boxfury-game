import Game from './scenes/game';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: Game.WIDTH,
  height: Game.HEIGHT,
  scene: Game,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: true,
    },
  },
};

const game = new Phaser.Game(config);

// TODO list
// 0. Fix shooting bullets to have zero gravity
// 1. Fix the player's collision with the blocks
// 2. Make the game responsive to the window size
// 3. Add a level editor or generate new levels with some algorithm
// 4. Add a menu
// 5. Add sprites
// 6. Add sounds
// 9. Add a score board
// 10. Add capture the flag mode with two teams
// 11. Add a multiplayer mode
