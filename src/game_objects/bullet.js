import Block from './block.js';

class Bullet extends Phaser.GameObjects.Arc {
  static SIZE = 4;
  static COLOR = 0xfeefdd;

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

  update() {
    if (this.x < 0 || this.x > this.scene.levelWidth * Block.SIZE ||
      this.y < 0 || this.y > this.scene.levelHeight * Block.SIZE)
     {
        this.scene.bullets = this.scene.bullets.filter(bullet => bullet !== this);
        this.destroy();

    }
  }
}

export default Bullet;
