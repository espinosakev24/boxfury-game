import Phaser from 'phaser';
import logoImg from './assets/logo.png';

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('logo', logoImg);
  }

  create() {
    const graphics = this.add.graphics({
      fillStyle: { color: 0xffffff, width: 2 },
    });
    const circle = new Phaser.Geom.Circle(100, 100, 100);

    graphics.fillCircleShape(circle);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: MyGame,
};

const game = new Phaser.Game(config);
