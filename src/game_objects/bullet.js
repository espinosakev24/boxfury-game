import Game from '../scenes/game';

class Bullet extends Phaser.GameObjects.Arc {
  static SIZE = 4;
  static COLOR = 0xfeefdd;
  static SPEED = 400;

  constructor(game, x, y, shootAngle) {
    super(game, x, y, Bullet.SIZE, 0, 360, false, Bullet.COLOR, 1.0);

    game.add.existing(this);
    this.setOrigin(0, 0);
    this.scene.physics.add.existing(this);
    this.body.setVelocity(
      Math.sin(shootAngle) * Bullet.SPEED,
      Math.cos(shootAngle) * Bullet.SPEED
    );
  }

  update() {
    if (
      this.x < 0 ||
      this.x > Game.WIDTH ||
      this.y < 0 ||
      this.y > Game.HEIGHT
    ) {
      this.destroy();
    }
  }
}

export default Bullet;
