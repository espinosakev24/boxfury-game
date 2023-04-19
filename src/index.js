import Game from './scenes/game';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: Game.WIDTH,
  height: Game.HEIGHT,
  scene: Game,
};

const game = new Phaser.Game(config);
