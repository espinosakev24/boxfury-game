import Block from './block.js';

class Bullet extends Phaser.GameObjects.Arc {
  static SIZE = 4;
  static COLOR = 0xff0000;

  constructor(game, x, y, shootAngle, speed, playerDirection) {
    super(game, x, y, Bullet.SIZE, 0, 360, false, Bullet.COLOR, 1.0);

    game.add.existing(this);
    this.setOrigin(0, 0);
    this.scene.physics.add.existing(this);
    this.body.setVelocity(
      Math.sin(shootAngle) * speed * playerDirection,
      Math.cos(shootAngle) * speed
    );
  }
}

export default Bullet;
