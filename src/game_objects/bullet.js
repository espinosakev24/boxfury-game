class Bullet extends Phaser.GameObjects.Arc {
  static SIZE = 6;
  static COLOR = 0xff0000;

  constructor(scene, gameState, x, y, shootAngle, speed, playerDirection) {
    super(scene, x, y, Bullet.SIZE, 0, 360, false, Bullet.COLOR, 1.0);
    this.scene.add.existing(this);
    this.gameState = gameState;
    this.setOrigin(0, 0);
    this.scene.physics.add.existing(this);
    this.scene.physics.add.collider(this, this.gameState.layer, (gameObjectA, gameObjectB) => {
      this.destroy();
    });
    this.body.setVelocity(
      Math.sin(shootAngle) * speed * playerDirection,
      Math.cos(shootAngle) * speed
    );
  }
}

export default Bullet;
