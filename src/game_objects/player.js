import { GameObjects } from 'phaser';
import Game from '../scenes/game';

class Player extends Phaser.GameObjects.Rectangle {
  static SIZE = 32;
  static SPEED = 3;

  constructor(scene, x, y) {
    super(scene, x, y, Player.SIZE, Player.SIZE, 0xffffff);
    this.rect = scene.add.rectangle(x, y, Player.SIZE, Player.SIZE, 0xffffff);

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.rect.x -= Player.SPEED;
    }
    if (this.cursors.right.isDown) {
      this.rect.x += Player.SPEED;
    }
    if (this.cursors.up.isDown) {
      this.rect.y -= Player.SPEED;
    }
    if (this.cursors.down.isDown) {
      this.rect.y += Player.SPEED;
    }
  }
}

export default Player;
